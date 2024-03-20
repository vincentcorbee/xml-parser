export type TokenType =
  | 'LEFT_ANGLE_BRACKET'
  | 'RIGHT_ANGLE_BRACKET'
  | 'SYMBOL'
  | 'WHITE_SPACE'
  | 'NEW_LINE'
  | 'NAME'
  | 'EOF'
  | 'EQUAL'
  | 'DOUBLE_QUOTE'
  | 'SINGLE_QUOTE'
  | 'NAME_START'
  | 'TEXT'
  | 'SLASH'
  | 'APOSTROPHE'
  | 'SEMI'
  | 'TENARY';

export type Token = {
  type: TokenType;
  value: string;
};

export type InputToken = { type: TokenType; test: RegExp };

const TOKENS_INITIAL: InputToken[] = [
  {
    type: 'LEFT_ANGLE_BRACKET',
    test: /^</
  },
  {
    type: 'RIGHT_ANGLE_BRACKET',
    test: /^>/
  },
  {
    type: 'WHITE_SPACE',
    test: /^\s/
  },
  {
    type: 'NEW_LINE',
    test: /^\n|(\n\r)/
  },
  {
    type: 'TEXT',
    test: /^[^>]/
  }
];

const TOKENS_TAG: InputToken[] = [
  {
    type: 'EQUAL',
    test: /^=/
  },
  {
    type: 'DOUBLE_QUOTE',
    test: /^"/
  },
  {
    type: 'SLASH',
    test: /^\//
  },
  {
    type: 'SINGLE_QUOTE',
    test: /^'/
  },
  {
    type: 'APOSTROPHE',
    test: /^&/
  },
  {
    type: 'SEMI',
    test: /^;/
  },
  {
    type: 'TENARY',
    test: /^\?/
  },
  {
    type: 'NAME_START',
    test: /^[A-z:]/
  },
  {
    type: 'NAME',
    test: /^[A-z0-9\-]/
  },
  ...TOKENS_INITIAL
];

export type State = {
  name: StateNames;
  tokens: InputToken[];
};

export type StateNames = 'INITIAL' | 'IN_TAG';

export type States = Map<StateNames, State>;

export class Lexer {
  index: number;
  col: number;
  line: number;

  private state: State;

  private states: States;

  constructor(private _input: string) {
    this.index = 0;
    this.col = 1;
    this.line = 1;

    this.state = {
      name: 'INITIAL',
      tokens: TOKENS_INITIAL
    };

    this.states = new Map([
      [this.state.name, this.state],
      [
        'IN_TAG',
        {
          name: 'IN_TAG',
          tokens: TOKENS_TAG
        }
      ]
    ]);
  }

  get source() {
    return this._input.substring(0);
  }

  hasData(): boolean {
    return !this.assertType('EOF');
  }

  setState(name: StateNames) {
    this.state = this.states.get(name);
  }

  handleError(msg: string): never {
    throw Error(`${this.index}:${this.col}:${this.line} ${msg}`);
  }

  consume(...type: TokenType[]): Token {
    const token = this.next();

    if (type.length === 0) return token;

    if (type.some((t) => t === token.type)) return token;

    this.handleError(`Unexpected token: ${token.value}`);
  }

  consumeChar(toConsume?: string): string {
    const char = this._input[this.index++];

    this.col++;

    if (char === '\n') {
      this.line++;
      this.col = 1;
    }

    if (toConsume === undefined || char === toConsume) return char;

    this.handleError(`Unexpected token: ${char}`);
  }

  advanceChar(count = 1): string {
    let result = '';

    for (let i = 0; i < count; i++) result += this.consumeChar();

    return result;
  }

  consumeWhiteSpace() {
    return this.consumeWhile(({ type }) => type === 'WHITE_SPACE');
  }

  consumeLeftAngleBracket() {
    return this.consume('LEFT_ANGLE_BRACKET');
  }

  consumeRightAngleBracket() {
    return this.consume('RIGHT_ANGLE_BRACKET');
  }

  consumeWhile(predicate: (token: Token) => boolean | string): string {
    let output = '';

    while (this.hasData()) {
      let peeked = this.peek();

      const result = predicate(peeked);

      if (result === false) break;

      if (result === true) output += this.next().value;

      if (typeof result === 'string') output += result;
    }

    return output;
  }

  peekChar(pos = 0): string {
    return this._input[this.index + pos];
  }

  peek(): Token {
    const { index, col, line, state } = this;

    const token = this.next();

    this.index = index;
    this.col = col;
    this.line = line;
    this.state = state;

    return token;
  }

  peekAt(pos: number): Token {
    const { index, col, line, state } = this;

    for (let i = 0; i < pos - 1; i++) this.advance();

    const token = this.next();

    this.index = index;
    this.col = col;
    this.line = line;
    this.state = state;

    return token;
  }

  assert(predicate: (token: Token) => boolean): boolean {
    const { index, col, line } = this;

    const token = this.next();

    this.index = index;
    this.col = col;
    this.line = line;

    return predicate(token);
  }

  assertType(...type: TokenType[]): boolean {
    return this.assert((token) => type.includes(token.type));
  }

  isToken(): Token {
    const { index, col, line } = this;

    const token = this.next();

    this.index = index;
    this.col = col;
    this.line = line;

    return token;
  }

  advance(): Token {
    return this.next();
  }

  next(): Token {
    const { _input: input, index } = this;

    const source = input.slice(index);

    if (source.length === 0)
      return {
        type: 'EOF',
        value: ''
      };

    for (const token of this.state.tokens) {
      const matchArray = source.match(token.test);

      if (matchArray) {
        const [value] = matchArray;

        this.index += value.length;
        this.col += value.length;

        if (token.type === 'NEW_LINE' || value === '\n') {
          this.col = 0;
          this.line++;
        }

        if (token.type === 'LEFT_ANGLE_BRACKET') this.setState('IN_TAG');

        if (token.type === 'RIGHT_ANGLE_BRACKET') this.setState('INITIAL');

        return {
          type: token.type,
          value
        };
      }
    }

    throw Error('Syntax error');
  }
}
