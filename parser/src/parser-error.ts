export class ParserError extends Error {
  constructor({
    message = '',
    index,
    col,
    line,
    source
  }: {
    message?: string;
    index: number;
    col: number;
    line: number;
    source: string;
  }) {
    const lineIndicator = '>';
    const border = '|';

    message += ` at line: ${line} column: ${col} index: ${index}\n\n`;

    const highlightedSource = source
      .split('\n')
      .slice(Math.max(line - 4, 0), line)
      .join('\n');

    const lines = highlightedSource.split('\n');

    const spacing = `${line}`.length + 2;

    let lineNumber = Math.max(line - 3, 1);

    for (let i = 0, l = lines.length; i < l; i++) {
      const currentLineNumber = `${lineNumber}`;

      message += `${lineNumber === line ? `${lineIndicator} ` : '  '}${currentLineNumber}${' '.repeat(spacing - currentLineNumber.length)}${border} ${lines[i]}\n`;

      lineNumber++;
    }

    message += `  ${' '.repeat(spacing)}${border} ${' '.repeat(col)}${'^'.repeat(1)}`;

    super(message);
  }
}
