import { CharCodes, Tokens } from '../constants';
import { ParserError } from '../parser-error';
import {
  isChar,
  isDigit,
  isEncNameChar,
  isLetter,
  isNCNameChar,
  isNameChar,
  isNameStartChar,
  isS
} from './helpers';

const {
  EOF,
  WHITE_SPACE,
  TAB,
  NEWLINE,
  CARRIAGE_RETURN,
  LEFT_ANGLE_BRACKET,
  RIGHT_ANGLE_BRACKET,
  APOSTROPHE,
  DOUBLE_QUOTE,
  SINGLE_QUOTE,
  SLASH,
  SEMI,
  EQUAL,
  PERIOD,
  ENTITY_DECLARATION_START,
  CDATA_START,
  CDATA_END,
  COMMENT_START,
  COMMENT_END,
  DOCTYPE_START,
  XML_DECLARATION_START,
  XML_DECLARATION_END,
  START_END_TAG,
  START_PROCESSING_INSTRUCTION,
  END_PROCESSING_INSTRUCTION
} = Tokens;

const { NEWLINE: NEWLINE_CODE } = CharCodes;

export class Lexer {
  private _source: string;

  index: number;
  col: number;
  line: number;

  constructor(source: string) {
    this.index = 0;
    this.col = 1;
    this.line = 1;
    this._source = source;
  }

  handleError(message: string, supressErrors = false): never | ParserError {
    const { index, col, line, source } = this;

    const parseError = new ParserError({
      message,
      index,
      col,
      line,
      source
    });

    if (supressErrors) return parseError;

    throw parseError;
  }

  get source() {
    return this._source;
  }

  hasData(): boolean {
    const { index, _source: _input } = this;

    return index < _input.length;
  }

  peek(): string {
    const { index, _source: _input } = this;

    if (index >= _input.length) return EOF;

    return _input[index];
  }

  peekAt(pos = 0): string {
    const { index, _source: _input } = this;

    const newIndex = index + pos;

    if (newIndex >= _input.length) return EOF;

    const char = _input[newIndex];

    return char;
  }

  match(char: string) {
    return this.peek() === char;
  }

  matchAndEat(char: string): boolean {
    const lookahead = this.peek();

    if (char !== lookahead) return false;

    this.index++;
    this.col++;

    if (char === NEWLINE) {
      this.line++;
      this.col = 1;
    }

    return true;
  }

  matchString(needle: string): boolean {
    const { _source, index } = this;
    const { length } = _source;

    const { length: needleLength } = needle;

    if (index + needleLength > length) return false;

    for (let i = 0; i < needleLength; i++) {
      if (_source[index + i] !== needle[i]) return false;
    }

    return true;
  }

  matchStringAndEat(needle: string): boolean {
    const { _source, index } = this;
    const { length } = _source;

    const { length: needleLength } = needle;

    if (index + needleLength > length) return false;

    for (let i = 0; i < needleLength; i++) {
      if (_source[index + i] !== needle[i]) return false;
    }

    this.index += needleLength;
    this.col += needleLength;

    return true;
  }

  matchNameStartChar(): boolean {
    return isNameStartChar(this.peek());
  }

  matchNameChar(): boolean {
    return isNCNameChar(this.peek());
  }

  matchS(): boolean {
    return isS(this.peek());
  }

  matchChar(): boolean {
    return isChar(this.peek());
  }

  consume(char?: string): string {
    const nextChar = this.peek();

    if (nextChar === char) return this.advance(nextChar);

    if (char === undefined) return this.advance(nextChar);

    this.handleError(`Unexpected token: ${nextChar}`);
  }

  consumeOneOf(...char: string[]): string {
    const { length } = char;

    const nextChar = this.peek();

    for (let i = 0; i < length; i++) {
      if (nextChar === char[i]) return this.advance(nextChar);
    }

    this.handleError(`Unexpected token: ${nextChar}`);
  }

  consumeString(input: string): string {
    let output = '';

    for (let i = 0, l = input.length; i < l; i++) {
      const nextChar = this.peek();

      if (nextChar !== input[i])
        this.handleError(`Unexpected token: ${nextChar}.`);

      output += this.advance(nextChar);
    }

    return output;
  }

  consumeQuote() {
    return this.consumeOneOf(SINGLE_QUOTE, DOUBLE_QUOTE);
  }

  consumeDigit() {
    const nextChar = this.nextChar();

    if (!isDigit(nextChar)) this.handleError(`Unexpected token: ${nextChar}.`);

    return nextChar;
  }

  consumeDigits() {
    let output = this.consumeDigit();

    while (isDigit(this.peek())) output += this.nextChar();

    return output;
  }

  consumePeriod() {
    return this.consume(PERIOD);
  }

  consumeEntityDeclarationStart() {
    return this.consumeString(ENTITY_DECLARATION_START);
  }

  consumeCDATAStart() {
    return this.consumeString(CDATA_START);
  }

  consumeStartProcessingInstruction() {
    return this.consumeString(START_PROCESSING_INSTRUCTION);
  }

  consumeEndProcessingInstruction() {
    return this.consumeString(END_PROCESSING_INSTRUCTION);
  }

  consumeCDATAEnd() {
    return this.consumeString(CDATA_END);
  }

  consumeXMLDeclarationStart() {
    return this.consumeString(XML_DECLARATION_START);
  }

  consumeXMLDeclarationEnd() {
    return this.consumeString(XML_DECLARATION_END);
  }

  consumeDoctypeStart() {
    return this.consumeString(DOCTYPE_START);
  }

  consumeCommentStart() {
    return this.consumeString(COMMENT_START);
  }

  consumeCommentEnd() {
    return this.consumeString(COMMENT_END);
  }

  consumeSlash() {
    return this.consume(SLASH);
  }

  consumeStartEndTag() {
    return this.consumeString(START_END_TAG);
  }

  consumeLeftAngleBracket() {
    return this.consume(LEFT_ANGLE_BRACKET);
  }

  consumeRightAngleBracket() {
    return this.consume(RIGHT_ANGLE_BRACKET);
  }

  consumeApostrophe() {
    return this.consume(APOSTROPHE);
  }

  consumeSemi() {
    return this.consume(SEMI);
  }

  consumeEqual() {
    return this.consume(EQUAL);
  }

  consumeDoubleQuote() {
    return this.consume(DOUBLE_QUOTE);
  }

  consumeNameStartChar() {
    const nextChar = this.peek();

    if (isNameStartChar(nextChar)) return this.advance(nextChar);

    this.handleError(`Unexpected name start char: ${nextChar}.`);
  }

  consumeEncNameStartChar() {
    const nextChar = this.peek();

    if (isLetter(nextChar)) return this.advance(nextChar);

    this.handleError(`Invalid character in encoding name: ${nextChar}.`);
  }

  consumeNCame() {
    let output = this.consumeNameStartChar();

    while (isNCNameChar(this.peek())) output += this.nextChar();

    return output;
    // return `${this.consumeNameStartChar()}${this.eatWhile(isNCNameChar)}`;
  }

  consumeName() {
    let output = this.consumeNameStartChar();

    while (isNameChar(this.peek())) output += this.nextChar();

    return output;
    // return `${this.consumeNameStartChar()}${this.eatWhile(isNameChar)}`;
  }

  consumeEncName() {
    let output = this.consumeEncNameStartChar();

    while (isEncNameChar(this.peek())) output += this.nextChar();

    return output;
    // return `${this.consumeEncNameStartChar()}${this.eatWhile(isEncNameChar)}`;
  }

  consumeS() {
    return `${this.consumeOneOf(WHITE_SPACE, NEWLINE, TAB, CARRIAGE_RETURN)}${this.eatS()}`;
  }

  eatWhile(predicate: (char: string) => boolean | string): string {
    let output = '';

    let result: boolean | string;

    while ((result = predicate(this.peek()))) {
      if (result === true) output += this.nextChar();

      if (typeof result === 'string') output += result;
    }

    return output;
  }

  eatCDATA() {
    return this.eatWhile((char) => {
      if (char === LEFT_ANGLE_BRACKET && this.matchString(CDATA_END))
        return false;

      return isChar(char);
    });
  }

  eatDigits() {
    let output = this.consumeNameStartChar();

    while (isDigit(this.peek())) output += this.nextChar();

    return output;
  }

  eatS(): string {
    return this.eatWhile(isS);
  }

  /* Unsafe */
  advance(char: string): string {
    const { _source } = this;

    this.index++;

    if (char === NEWLINE) {
      this.line++;
      this.col = 1;

      return NEWLINE;
    }

    if (char === CARRIAGE_RETURN) {
      const nextChar = _source[this.index];

      if (nextChar === NEWLINE) {
        this.line++;
        this.col = 1;
        this.index++;
      }

      return NEWLINE;
    }

    this.col++;

    return char;
  }

  nextCharCode(): number {
    const { index, _source } = this;

    if (index === _source.length) CharCodes.EOF;

    const char = _source[this.index++];

    if (char === NEWLINE) {
      this.line++;
      this.col = 1;

      return NEWLINE_CODE;
    }

    if (char === CARRIAGE_RETURN) {
      const nextChar = _source[this.index];

      if (nextChar === NEWLINE) {
        this.line++;
        this.col = 1;
        this.index++;
      }

      return NEWLINE_CODE;
    }

    this.col++;

    return char.charCodeAt(0);
  }

  nextChar(): string {
    const { index, _source } = this;

    if (index === _source.length) CharCodes.EOF;

    const char = _source[this.index++];

    if (char === NEWLINE) {
      this.line++;
      this.col = 1;

      return NEWLINE;
    }

    if (char === CARRIAGE_RETURN) {
      const nextChar = _source[this.index];

      if (nextChar === NEWLINE) {
        this.line++;
        this.col = 1;
        this.index++;
      }

      return NEWLINE;
    }

    this.col++;

    return char;
  }
}
