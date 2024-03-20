const CHARS = {
  A: 'CAPITAL_A',
  Z: 'CAPITAL_Z',
  a: 'LOWER_CASE_A',
  z: 'LOWER_CASE_Z',
  '<': 'LEFT_ANGLE_BRACKET',
  '>': 'RIGHT_ANGLE_BRACKET',
  '=': 'EQUAL',
  ';': 'SEMI',
  ':': 'COLON',
  '?': 'QUESTION_MARK',
  '!': 'EXCLAMATION_MARK',
  '|': 'VERTICAL_BAR',
  '-': 'HYPHEN',
  '[': 'LEFT_SQUARE_BRACKET',
  ']': 'RIGHT_SQUARE_BRACKET',
  _: 'UNDERSCORE',
  '.': 'PERIOD',
  '/': 'SLASH',
  '&': 'APOSTROPHE',
  "'": 'SINGLE_QUOTE',
  '"': 'DOUBLE_QUOTE',
  '%': 'PERCENT',
  '\n': 'NEWLINE',
  '\r': 'CARRIAGE_RETURN',
  '\t': 'TAB',
  ' ': 'WHITE_SPACE',
  '\x00': 'EOF'
} as const;

function mapCode(code: number | string) {
  if (CHARS[code] !== undefined) return `Tokens.${CHARS[code]}`;

  return `0x${(typeof code === 'string' ? code.charCodeAt(0) : code).toString(16).toLowerCase()}`;
}

function escapeSlash(char: string) {
  switch (char) {
    case '\n':
      return '\\n';
    case '\t':
      return '\\t';
    case "'":
      return "\\'";
    case 's':
      return '\\s';
    case '\r':
      return `\\r`;
    default:
      return char;
  }
}

function createRangeConditions(range: (string | number)[][]) {
  let conditions = '';

  for (const [lo, hi] of range) {
    if (hi === undefined)
      conditions += `if (token === ${mapCode(lo)}) return true\n`;
    else
      conditions += `if (token >= ${mapCode(lo)} && token <= ${mapCode(hi)}) return true\n`;
  }

  return conditions;
}

function createASCIITable() {
  let table = 'export const ASCIITable = {\n';

  for (let i = 0x20; i < 0x7f; i++) {
    table += `  '${String.fromCharCode(i)}': 0x${i.toString(16)},\n`;
  }

  table += '} as const';

  console.log(table);
}

export function generateCode() {
  let tokenChars = 'const TokenChar = {\n';

  Object.entries(CHARS).forEach(([key, value]) => {
    tokenChars += `  ${value}: '${escapeSlash(key)}',\n`;
  });

  tokenChars += '} as const';

  console.log(tokenChars);

  const type = Object.values(CHARS).reduce(
    (acc, value) => `${acc} | '${value}'\n`,
    'type TokenType =\n'
  );

  console.log(type);

  const rangesNameStartChar = [
    [':'],
    ['_'],
    ['A', 'Z'],
    ['a', 'z'],
    [0xc0, 0xd6],
    [0xd8, 0xf6],
    [0xf8, 0x2ff],
    [0x370, 0x37d],
    [0x37f, 0x1fff],
    [0x200c, 0x200d],
    [0x2070, 0x218f],
    [0x2c00, 0x2fef],
    [0x3001, 0xd7ff],
    [0xf900, 0xfdcf],
    [0xfdf0, 0xfffd],
    [0x10000, 0xeffff]
  ];
  const rangesNameChar = [
    ['-'],
    ['.'],
    [0x30, 0x39],
    [0xb7],
    [0x0300, 0x036f],
    [0x203f, 0x2040]
  ];
  const rangesWhiteSpace = [[0x20], [0x9], [0xd], [0xa]];
  const rangeChar = [
    [0x9],
    [0xa],
    [0xd],
    [0x20, 0xd7ff],
    [0xe000, 0xfffd],
    [0x10000, 0x10ffff]
  ];

  const nameStartCharConditions = createRangeConditions(rangesNameStartChar);
  const nameCharConditions = createRangeConditions(rangesNameChar);
  const whiteSpaceConditions = createRangeConditions(rangesWhiteSpace);
  const charConditions = createRangeConditions(rangeChar);

  console.log(nameStartCharConditions);
  console.log(nameCharConditions);
  console.log(whiteSpaceConditions);
  console.log(charConditions);

  let tokens = 'const Tokens = {\n';

  Object.entries(CHARS).forEach(([char, name]) => {
    tokens += `  ${name}: 0x${char.charCodeAt(0).toString(16)},\n`;
  });

  tokens += '} as const';

  console.log(tokens);

  createASCIITable();
}
