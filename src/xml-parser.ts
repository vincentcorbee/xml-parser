import {
  attrRegExp,
  CDATARegExp,
  commentRegExp,
  contentRegExp,
  danglingAmpRegExp,
  doctypeRegExp,
  endTagRegExp,
  Entities,
  entityRefRegExp,
  GEDeclarationRegExp,
  linesRegExp,
  startTagRegExp,
  whiteSpaceRegExp,
  xmlDeclarationRegExp
} from './constants';
import { traverse } from './traverse';
import {
  Attributes,
  DeclaredEntities,
  DocumentNode,
  StackNode,
  TagNode
} from './types';
import { visitors } from './visitors';

export class XMLParser {
  private index: number;

  private column: number;

  private line: number;

  private source: string;

  private declaredEntities: DeclaredEntities;

  constructor(private options: { removeNSPrefix?: boolean } = {}) {
    this.column = 1;
    this.index = 0;
    this.line = 1;
    this.source = '';
    this.declaredEntities = { ...Entities };
  }

  private reset() {
    this.column = 1;
    this.index = 0;
    this.line = 1;
    this.source = '';
    this.declaredEntities = { ...Entities };
  }

  private peek(stack: StackNode[]): StackNode | null {
    return stack[stack.length - 1] ?? null;
  }

  private handleError(message: string) {
    let errorMessage = message;

    const { line, column, index } = this;

    const source = this.source.split('\n')[line - 1];

    const indicator = `${line}:${column}:${index}  `;

    if (source !== undefined) {
      errorMessage += `\n\n${indicator}${source}\n`;

      let currentCol = column + indicator.length - 1;

      while (currentCol--) errorMessage += ' ';

      errorMessage += '^';
    }

    return Error(errorMessage);
  }

  private updatePosition(input: string) {
    let match: RegExpMatchArray | null;
    let lastMatch: RegExpMatchArray | null = null;
    let lines = 0;

    const { length } = input;

    while ((match = linesRegExp.exec(input))) {
      lines++;

      lastMatch = match;
    }

    this.index += length;

    this.line += lines;

    if (lines > 0) this.column = input.length - lastMatch!.index!;
    else this.column += length;
  }

  private updateInput(input: string, match: string): string {
    this.updatePosition(match);

    return input.slice(match.length);
  }

  private parseAttributes(input: string) {
    const trimmedInput = input.trim();

    let attrMatch: RegExpExecArray | null;

    const attributes: Attributes = {};

    const { column, line, index } = this;

    while ((attrMatch = attrRegExp.exec(trimmedInput))) {
      const [match, name, eq, value] = attrMatch;

      this.updatePosition(match);

      if (eq && !value) throw this.handleError(`Invalid attribute ${name}`);

      attributes[name] = {
        type: 'attribute',
        raw: match,
        value: eq ? this.parseEntityRefs(value).slice(1, -1) : true,
        name
      };
    }

    this.column = column;
    this.line = line;
    this.index = index;

    return attributes;
  }

  private parseInternalSubset(source: string) {
    let input = source;

    while (input) {
      switch (input[0]) {
        case '[':
        case ']': {
          input = this.updateInput(input, input[0]);

          continue;
        }
      }

      const whiteSpaceMatch = input.match(whiteSpaceRegExp);

      if (whiteSpaceMatch) {
        const [match] = whiteSpaceMatch;

        input = this.updateInput(input, match);

        continue;
      }

      const entityDeclarationMatch = input.match(GEDeclarationRegExp);

      if (entityDeclarationMatch) {
        input = this.parseEntityDeclaration(input, entityDeclarationMatch);

        continue;
      }

      throw this.handleError('Invalid internal subset in doctype declaration');
    }
  }

  private parseEntityDeclaration(
    input: string,
    entityDeclarationMatch: RegExpMatchArray
  ): string {
    const [match, namespace = '', localname, value] = entityDeclarationMatch;

    const name = `&${namespace}${localname};`;

    this.declaredEntities[name] = `${value.slice(1, -1)}`;

    return this.updateInput(input, match);
  }

  private parseEntityRefs(input: string): string {
    const danglingAmpMatch = input.match(danglingAmpRegExp);

    if (danglingAmpMatch) {
      this.updatePosition(input.slice(0, danglingAmpMatch.index));

      throw this.handleError(`Invalid character: "&"`);
    }

    return input.replace(
      entityRefRegExp,
      (match) => this.declaredEntities[match] ?? match
    );
  }

  parse(xml: string) {
    this.reset();

    this.source = xml;

    let input = xml;

    const doc: DocumentNode = {
      type: 'document',
      name: '#document',
      xmlDeclaration: null,
      docType: null,
      root: null
    };

    const stack: StackNode[] = [];

    let parent: TagNode | null = null;

    while (input) {
      const xmlDeclarationMatch = input.match(xmlDeclarationRegExp);

      if (xmlDeclarationMatch) {
        if (this.index > 0 || doc.root)
          throw this.handleError(
            'XML declaration only allowed at start of document'
          );

        if (doc.xmlDeclaration)
          throw this.handleError('XML declaration already exists');

        const [match, attributes] = xmlDeclarationMatch;

        if (attributes)
          this.updatePosition(match.slice(0, match.indexOf(attributes)));

        const attrs = this.parseAttributes(attributes);

        doc.xmlDeclaration = {
          type: 'xmlDeclaration',
          name: '#declaration',
          raw: match,
          version: attrs.version,
          standalone: attrs.standalone,
          attrs
        };

        input = this.updateInput(input, match);

        continue;
      }

      const docTypeMatch = input.match(doctypeRegExp);

      if (docTypeMatch) {
        if (doc.root)
          throw this.handleError('DOCTYPE only alowed before root element');

        if (doc.docType) throw this.handleError('DOCTYPE already declared');

        const [match, namespace = '', localname = '', intSubset] = docTypeMatch;

        this.parseInternalSubset(intSubset);

        doc.docType = {
          type: 'doctype',
          name: '#doctype',
          raw: match
        };

        input = this.updateInput(input, match);

        continue;
      }

      const CDATAMatch = input.match(CDATARegExp);

      if (CDATAMatch) {
        const [match, content] = CDATAMatch;

        if (parent)
          parent.children.push({
            type: 'cdata',
            name: '#cdata',
            value: content,
            raw: match
          });

        input = this.updateInput(input, match);

        continue;
      }

      const entityDeclarationMatch = input.match(GEDeclarationRegExp);

      if (entityDeclarationMatch) {
        input = this.parseEntityDeclaration(input, entityDeclarationMatch);

        continue;
      }

      const startTagMatch = input.match(startTagRegExp);

      if (startTagMatch) {
        if (doc.root && !parent)
          throw this.handleError('Only one root element is allowed.');

        const [match, namespace = '', localname, attributes = '', closing] =
          startTagMatch;

        const isEmptyTag = closing || attributes === '/';

        if (attributes && attributes !== '/')
          this.updatePosition(match.slice(0, match.indexOf(attributes)));

        const attrs = this.parseAttributes(attributes);

        const node: TagNode = {
          type: 'tag',
          name: `${this.options.removeNSPrefix ? '' : namespace}${localname}`,
          attrs,
          children: []
        };

        if (parent) parent.children.push(node);

        if (!doc.root) doc.root = node;

        if (isEmptyTag) {
          node.type = 'emptyTag';

          node.children.push({
            type: 'text',
            name: '#text',
            value: ''
          });
        } else {
          stack.push({
            node,
            parentNode: parent,
            indexNode: Math.max((parent?.children.length ?? 0) - 1, 0)
          });

          parent = node;
        }

        input = this.updateInput(input, match);

        continue;
      }

      const endTagMatch = input.match(endTagRegExp);

      if (endTagMatch) {
        const [match, namespace = '', localname] = endTagMatch;

        const name = `${this.options.removeNSPrefix ? '' : namespace}${localname}`;

        const { node } = stack.pop() as StackNode;

        if (node?.name !== name)
          throw this.handleError(
            `Unexpected closing tag: ${name}, expected: ${node?.name}`
          );

        const top = this.peek(stack);

        parent = top?.node?.type === 'tag' ? top.node : null;

        input = this.updateInput(input, match);

        continue;
      }

      const commentMatch = input.match(commentRegExp);

      if (commentMatch) {
        const [match] = commentMatch;

        if (parent)
          parent.children.push({
            type: 'comment',
            name: '#comment',
            value: match
          });

        this.updatePosition(match);

        input = input.slice(match.length);

        continue;
      }

      const contentMatch = input.match(contentRegExp);

      if (contentMatch) {
        const [match] = contentMatch;

        if (parent)
          parent.children.push({
            type: 'text',
            name: '#text',
            value: this.parseEntityRefs(match)
          });

        input = this.updateInput(input, match);

        continue;
      }

      const whiteSpaceMatch = input.match(whiteSpaceRegExp);

      if (whiteSpaceMatch) {
        const [match] = whiteSpaceMatch;

        input = this.updateInput(input, match);

        continue;
      }

      throw this.handleError('Invalid input');
    }

    if (!doc.root) throw this.handleError('Root element missing.');

    return doc;
  }

  toJSObject(doc: DocumentNode) {
    if (!doc.root) return null;

    return traverse({ node: doc.root, visitors, result: {} });
  }
}
