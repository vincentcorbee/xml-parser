import { Lexer } from './src/lexer/lexer';

const input = 'a'.repeat(10000);

const lexer = new Lexer(input);

const obj = {};

for (let i = 0, l = 1000; i < l; i++) {
  obj[i] = i;
}

console.log(obj);

const s = performance.now();

// lexer.consumeChar(TokenChars.SLASH);
// lexer.consumeS();
// for (let i = 0, l = input.length; i < l; i++) {
//   input[i];
// }

const e = performance.now();

console.log(e - s);
