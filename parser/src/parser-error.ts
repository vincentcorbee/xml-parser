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
    const padding = 2;
    const spacing = `${line}`.length + padding;

    let startingLine = Math.max(line - 3, 1);

    for (let i = 0, l = lines.length; i < l; i++) {
      const currentLine = `${startingLine}`;

      message += `${startingLine === line ? `${lineIndicator} ` : ' '.repeat(padding)}${currentLine}${' '.repeat(spacing - currentLine.length)}${border} ${lines[i]}\n`;

      startingLine++;
    }

    message += `${' '.repeat(padding)}${' '.repeat(spacing)}${border} ${' '.repeat(col - 1)}${'^'.repeat(1)}`;

    super(message);
  }
}
