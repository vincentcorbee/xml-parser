import { Entities, GlobalNamespaceURI, NodeTypes, Tokens } from './constants';
import { Lexer, isChar, isInTag, isNameStartChar } from './lexer';
import { ParserError } from './parser-error';
import {
  AttributeNode,
  Attributes,
  CDATASectionNode,
  CommentNode,
  DeclaredEntities,
  DocumentNode,
  DocumentTypeNode,
  ElementNode,
  QName,
  ProcessingInstructionNode,
  TextNode,
  XMLDeclarationNode
} from './types';

const {
  COMMENT_NODE,
  DOCUMENT_NODE,
  XML_DECLARATION_NODE,
  ELEMENT_NODE,
  PROCESSING_INSTRUCTION_NODE,
  TEXT_NODE,
  CDATA_SECTION_NODE,
  DOCUMENT_TYPE_NODE,
  ATTRIBUTE_NODE
} = NodeTypes;

const {
  RIGHT_ANGLE_BRACKET,
  LEFT_ANGLE_BRACKET,
  SLASH,
  APOSTROPHE,
  COLON,
  DOUBLE_QUOTE,
  PERCENT,
  START_END_TAG,
  COMMENT_START,
  START_PROCESSING_INSTRUCTION,
  END_PROCESSING_INSTRUCTION,
  XML_DECLARATION_START,
  ENTITY_DECLARATION_START,
  DOCTYPE_START,
  CDATA_START,
  COMMENT_END,
  DOUBLE_HYPHEN,
  EOF
} = Tokens;

export class XMLParser {
  private lexer: Lexer;
  private declaredEntities: DeclaredEntities;

  private localNsMap: Map<string, string>;
  private nsMap: Map<string, string>;
  private supressErrors: boolean;
  private parentNode: ElementNode | DocumentNode | null;

  constructor(source: string, options: { supressErrors?: boolean } = {}) {
    this.lexer = new Lexer(source);
    this.declaredEntities = { ...Entities };
    this.localNsMap = new Map<string, string>();
    this.nsMap = new Map<string, string>();
    this.supressErrors = options.supressErrors ?? false;
    this.parentNode = null;
  }

  private handleError(message: string): never | ParserError {
    return this.lexer.handleError(message, this.supressErrors);
  }

  private getNamespaceURI(prefix: string): string | undefined {
    return this.localNsMap.get(prefix) ?? this.nsMap.get(prefix);
  }

  private setLocalNamespaceURI(prefix: string, value: string): void {
    this.localNsMap.set(prefix, value);
  }

  /*
    [14] CharData ::= [^<&]* - ([^<&]* ']]>' [^<&]*)
  */
  private parseCharData(): string {
    const { lexer } = this;

    let output = '';

    let token: string;

    while ((token = lexer.peek()) !== EOF) {
      if (token === LEFT_ANGLE_BRACKET) break;

      if (token === APOSTROPHE) output += this.parseEntityRef();
      else output += lexer.advance(token);
    }

    return output;
  }

  /*
    [68] EntityRef ::= '&' Name ';'
  */
  private parseEntityRef(): string {
    const { lexer } = this;

    lexer.consumeApostrophe();

    const name = lexer.consumeName();

    lexer.consumeSemi();

    const value = this.declaredEntities[`&${name};`];

    if (value === undefined)
      this.handleError(`Entity "${name}" is not defined.`);

    return value;
  }

  /*
    [7]  QName ::= PrefixedName | UnprefixedName
    [8]  PrefixedName ::= Prefix ':' LocalPart
    [9]  UnprefixedName ::= LocalPart
    [10] Prefix ::= NCName
    [11] LocalPart ::= NCName
  */
  private parseQName(): QName {
    const { lexer } = this;

    const name = lexer.consumeNCame();

    if (lexer.matchAndEat(COLON)) {
      const localName = lexer.consumeNCame();

      return {
        prefix: name,
        localName,
        name: `${name}:${localName}`
      };
    }

    return {
      localName: name,
      name,
      prefix: null
    };
  }

  /*
    [42] ETag ::= '</' QName S? '>'
  */
  private parseETag(tagName: string): void {
    const { lexer } = this;

    lexer.consumeStartEndTag();

    const { name } = this.parseQName();

    if (name !== tagName)
      this.handleError(`Unexpected closing tag: ${name} expected: ${tagName}`);

    lexer.eatS();

    lexer.consumeRightAngleBracket();
  }

  /*
    [10] AttValue ::= '"' ([^<&"] | Reference)* '"' |  "'" ([^<&'] | Reference)* "'"
  */
  private parseAttValue(): string {
    const { lexer } = this;

    const quote = lexer.consumeQuote();

    let output = '';

    let token: string;

    while ((token = lexer.peek()) !== EOF) {
      if (token === quote) break;

      if (token === LEFT_ANGLE_BRACKET || token === RIGHT_ANGLE_BRACKET)
        this.handleError(
          `Unescaped "${token}" not allowed in attribute value.`
        );

      if (token === APOSTROPHE) output += this.parseEntityRef();
      else output += lexer.advance(token);
    }

    /* Consume matching quote */

    lexer.advance(quote);

    return output;
  }

  private parseAttributes(ownerElement: ElementNode): Attributes {
    const { lexer } = this;

    const { attributes } = ownerElement;

    const attributesWithNs: Record<string, string> = {};

    while (lexer.eatS() && isInTag(lexer.peek())) {
      const attribute = this.parseAttribute(ownerElement);

      const { prefix, name } = attribute;

      if (prefix && prefix !== 'xmlns') attributesWithNs[prefix] = name;

      attributes[name] = attribute;
    }

    for (const prop in attributesWithNs) {
      const value = attributesWithNs[prop];

      const namespaceURI = this.getNamespaceURI(prop);

      if (!namespaceURI)
        this.handleError(
          `Namespace prefix "${prop}" for "${value}" is not defined.`
        );

      attributes[value].namespaceURI = namespaceURI;
    }

    return attributes;
  }

  /*
    [25] Eq ::= S? '=' S?
  */
  private parseEq(): string {
    const { lexer } = this;

    return `${lexer.eatS()}${lexer.consumeEqual()}${lexer.eatS()}`;
  }

  /*
    Namespaces in XML 1.0 (Third Edition)

    [15] Attribute      ::= NSAttName Eq AttValue | QName Eq AttValue
    [1] NSAttName	      ::= PrefixedAttName | DefaultAttName
    [2] PrefixedAttName	::= 'xmlns:' NCName
    [3] DefaultAttName	::= 'xmlns'
  */
  private parseAttribute(ownerElement: ElementNode): AttributeNode {
    const { name, prefix, localName } = this.parseQName();

    this.parseEq();

    const value = this.parseAttValue();

    let namespaceURI = null;

    if (name === 'xmlns') {
      if (value === GlobalNamespaceURI.xml)
        this.handleError('xml namespace URI cannot be the default namespace.');

      this.setLocalNamespaceURI('', value);

      namespaceURI = GlobalNamespaceURI.xmlns;
    } else if (prefix === 'xmlns') {
      if (localName === 'xml' && value !== GlobalNamespaceURI.xml)
        this.handleError('xml namespace prefix mapped to wrong URI.');

      if (value === GlobalNamespaceURI.xml)
        this.handleError('xml namespace URI mapped to wrong prefix.');

      if (value === GlobalNamespaceURI.xmlns)
        this.handleError('Reuse of the xmlns namespace name is forbidden.');

      if (value === '')
        this.handleError('Empty namespace name is not allowed.');

      this.setLocalNamespaceURI(localName, value);
    }

    return {
      type: ATTRIBUTE_NODE,
      name,
      prefix,
      localName,
      value,
      namespaceURI,
      ownerElement
    };
  }

  /*
    [18] CDSect ::= CDStart CData CDEnd
  */
  private parseCDSect(): CDATASectionNode {
    const { lexer } = this;

    lexer.consumeCDATAStart();

    const value = lexer.consumeCDATA();

    lexer.consumeCDATAEnd();

    return {
      type: CDATA_SECTION_NODE,
      name: '#cdata-section',
      data: value
    };
  }

  /*
    [32] SDDecl ::= S 'standalone' Eq (("'" ('yes' | 'no') "'") | ('"' ('yes' | 'no') '"'))
  */
  private parseSDDecl(): boolean {
    const { lexer } = this;

    this.parseEq();

    const quote = lexer.consumeQuote();

    const standalone = lexer.eatWhile((token) => {
      if (token === quote) return false;

      return true;
    });

    lexer.consume(quote);

    if (standalone === 'yes') return true;

    if (standalone === 'no') return false;

    this.handleError(`Only "yes" or "no" is allowed for standalone.`);
  }

  /*
    [81] EncName ::= [A-Za-z] ([A-Za-z0-9._] | '-')*
  */
  private parseEncName(): string {
    return this.lexer.consumeEncName();
  }

  /*
    [80] EncodingDecl ::= S 'encoding' Eq ('"' EncName '"' | "'" EncName "'" )
  */
  private parseEncodingDecl(): string {
    const { lexer } = this;

    this.parseEq();

    const quote = lexer.consumeQuote();

    const encoding = this.parseEncName();

    lexer.consume(quote);

    return encoding;
  }

  /*
    [26] VersionNum ::= '1.' [0-9]+
  */
  private parseVersionNum(): string {
    const { lexer } = this;

    // const quote = lexer.consumeQuote();

    const major = lexer.nextChar();

    lexer.consumePeriod();

    const minor = lexer.nextCharCode();

    if (major !== '1' && (minor < 0x30 || minor > 0x39))
      this.handleError(
        `Unsupported version ${major}.${String.fromCharCode(minor)}`
      );

    // lexer.consume(quote);

    return `${major}.${String.fromCharCode(minor)}`;
  }

  /*
    [24] VersionInfo ::= S 'version' Eq ("'" VersionNum "'" | '"' VersionNum '"')
  */
  private parseVersionInfo(): string {
    const { lexer } = this;

    lexer.consumeS();

    const name = lexer.consumeName();

    if (name !== 'version')
      this.handleError('Malformed xml declaration expecting version.');

    this.parseEq();

    const quote = lexer.consumeQuote();

    const version = this.parseVersionNum();

    lexer.consume(quote);

    return version;
  }

  /*
    [23] XMLDecl ::= '<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>'
  */
  private parseXMLDecl(): XMLDeclarationNode {
    const { lexer } = this;

    lexer.consumeXMLDeclarationStart();

    const version = this.parseVersionInfo();

    let standalone = false;
    let encoding = 'UTF-8';

    while (lexer.eatS()) {
      if (!isInTag(lexer.peek())) break;

      const name = lexer.consumeName();

      switch (name) {
        case 'standalone':
          standalone = this.parseSDDecl();
          break;
        case 'encoding':
          encoding = this.parseEncodingDecl();
          break;
        default:
          this.handleError(`${name} not allowed in XML declaration.`);
      }
    }

    lexer.eatS();

    lexer.consumeXMLDeclarationEnd();

    return {
      type: XML_DECLARATION_NODE,
      name: '#xmlDeclaration',
      version,
      standalone,
      encoding
    };
  }

  /*
    [14] Comment ::= '<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'
  */
  private parseComment(): CommentNode {
    const { lexer } = this;

    lexer.consumeCommentStart();

    const data = lexer.eatWhile((token) => {
      if (lexer.matchString(COMMENT_END)) return false;

      if (lexer.matchString(DOUBLE_HYPHEN))
        this.handleError('Double hyphen within comment: <!--');

      return isChar(token);
    });

    if (!lexer.matchString(COMMENT_END))
      this.handleError('Comment not terminated');

    lexer.consumeCommentEnd();

    return {
      type: COMMENT_NODE,
      name: '#comment',
      data
    };
  }

  /*
    [17] PITarget ::= Name - (('X' | 'x') ('M' | 'm') ('L' | 'l'))
  */
  private parsePITarget(): string {
    const { lexer } = this;

    const name = lexer.consumeNCame();

    if (name.toLowerCase() === 'xml')
      this.handleError(
        'xml is not allowed as a processing instruction target.'
      );

    return name;
  }

  /*
    [16] PI ::= '<?' PITarget (S (Char* - (Char* '?>' Char*)))? '?>'
  */
  private parsePI(): ProcessingInstructionNode {
    const { lexer } = this;

    lexer.consumeStartProcessingInstruction();

    const PITarget = this.parsePITarget();

    lexer.eatS();

    const data = lexer.eatWhile((token) => {
      if (lexer.matchString(END_PROCESSING_INSTRUCTION)) return false;

      if (!isChar(token))
        this.handleError(
          `Invalid character in Processing instruction ${token}.`
        );

      return true;
    });

    lexer.consumeEndProcessingInstruction();

    return {
      type: PROCESSING_INSTRUCTION_NODE,
      target: PITarget,
      data,
      name: PITarget
    };
  }

  /*
    [43] content ::= CharData? ((element | Reference | CDSect | PI | Comment) CharData?)*
  */
  private parseContent(): void {
    const { lexer } = this;

    while (lexer.hasData()) {
      if (lexer.matchString(START_END_TAG)) break;

      this.parseElementChild();
    }
  }

  /*
    [39] element      ::= EmptyElemTag | STag content ETag

    Namespaces in XML 1.0 (Third Edition)

    [12] STag	        ::= '<' QName (S Attribute)* S? '>'
    [13] ETag	        ::= '</' QName S? '>'
    [14] EmptyElemTag	::= '<' QName (S Attribute)* S? '/>'
  */
  private parseElement(): ElementNode {
    const { lexer, nsMap, localNsMap, parentNode } = this;

    // lexer.consumeLeftAngleBracket();

    const { name, prefix, localName } = this.parseQName();

    const currentNsMap = nsMap;

    localNsMap.clear();

    const element: ElementNode = {
      type: ELEMENT_NODE,
      name,
      prefix,
      localName,
      attributes: {},
      children: [],
      namespaceURI: null,
      parentNode
    };

    parentNode.children.push(element);

    this.parentNode = element;

    element.attributes = this.parseAttributes(element);

    this.nsMap = new Map([...currentNsMap, ...localNsMap]);

    this.parseS();

    const isEmptyTag = lexer.match(SLASH);

    if (isEmptyTag) lexer.consume();

    lexer.consumeRightAngleBracket();

    if (!isEmptyTag) {
      this.parseContent();

      this.parseETag(name);
    }

    /* Restore nsMap */

    this.nsMap = currentNsMap;

    if (prefix) {
      const namespaceURI = this.getNamespaceURI(prefix);

      if (!namespaceURI)
        this.handleError(
          `Namespace prefix "${prefix}" on element "${localName}" is not defined.`
        );

      element.namespaceURI = namespaceURI;
    }

    return element;
  }

  private parseTextNode(): TextNode {
    const data = this.parseCharData();

    return {
      type: TEXT_NODE,
      name: '#text',
      data
    };
  }

  /*
    EntityValue ::= '"' ([^%&"] | PEReference | Reference)* '"' |  "'" ([^%&'] | PEReference | Reference)* "'"
  */
  private parseEntityValue(): string {
    const { lexer } = this;

    lexer.consumeDoubleQuote();

    let output = '';

    while (lexer.hasData()) {
      const token = lexer.peek();

      if (token === DOUBLE_QUOTE) break;

      if (token === APOSTROPHE) output += this.parseEntityRef();
      else output += lexer.nextChar();
    }

    lexer.consumeDoubleQuote();

    return output;
  }

  /*
    [71] GEDecl ::= '<!ENTITY' S Name S EntityDef S? '>'
  */
  private parseGEDecl() {
    const { lexer } = this;

    const name = `&${lexer.consumeName()};`;

    lexer.consumeS();

    const value = this.parseEntityValue();

    lexer.eatS();

    lexer.consumeRightAngleBracket();

    this.declaredEntities[name] = value;
  }

  /*
    [70] EntityDecl ::= GEDecl | PEDecl
  */
  private parseEntityDecl(): void {
    const { lexer } = this;

    lexer.consumeEntityDeclarationStart();

    lexer.consumeS();

    if (!lexer.match(PERCENT)) this.parseGEDecl();

    this.handleError('Parameter entity declarations are not supported.');
  }

  private parseIntSubset(): void {
    const { lexer } = this;

    lexer.consumeLeftAngleBracket();

    while (lexer.eatS()) {
      if (lexer.match(RIGHT_ANGLE_BRACKET)) break;

      if (lexer.matchString(ENTITY_DECLARATION_START)) {
        this.parseEntityDecl();

        continue;
      }

      this.handleError('Invalid internal subset in doctype declaration.');
    }

    lexer.consumeRightAngleBracket();
  }

  /*
    Namespaces in XML 1.0 (Third Edition)

    [16] doctypedecl ::= '<!DOCTYPE' S QName (S ExternalID)? S? ('[' (markupdecl | PEReference | S)* ']' S?)? '>'
  */
  private parseDoctypedecl(): DocumentTypeNode {
    const { lexer } = this;

    lexer.consumeDoctypeStart();

    lexer.eatS();

    if (!isNameStartChar(lexer.peek()))
      this.handleError('Doctype name is missing.');

    const { name } = this.parseQName();

    lexer.eatS();

    this.parseIntSubset();

    return {
      type: DOCUMENT_TYPE_NODE,
      name
    };
  }

  private parseElementChild():
    | CDATASectionNode
    | CommentNode
    | ElementNode
    | TextNode
    | ProcessingInstructionNode {
    const { lexer } = this;

    switch (true) {
      case lexer.matchString(CDATA_START):
        return this.parseCDSect();
      case lexer.matchString(COMMENT_START):
        return this.parseComment();
      case lexer.matchString(START_PROCESSING_INSTRUCTION):
        return this.parsePI();
      case lexer.matchAndEat(LEFT_ANGLE_BRACKET):
        return this.parseElement();
      case !lexer.match(RIGHT_ANGLE_BRACKET):
        return this.parseTextNode();
      default:
        this.handleError(`Unexpected character: ${lexer.peek()}`);
    }
  }

  /*
    [22] prolog ::= XMLDecl? Misc* (doctypedecl Misc*)?
  */
  private parseProlog(document: DocumentNode) {
    const { lexer } = this;

    if (lexer.matchString(XML_DECLARATION_START)) {
      if (lexer.index > 0)
        this.handleError('XML declaration only allowed at start of document.');

      const { encoding, standalone, version } = this.parseXMLDecl();

      document.characterSet = encoding;
      document.standalone = standalone;
      document.version = version;
    }

    this.parseMisc();

    if (lexer.matchString(DOCTYPE_START)) {
      if (document.documentElement)
        this.handleError('DOCTYPE only alowed before root element.');

      if (document.doctype) this.handleError('DOCTYPE already declared.');

      const doctype = this.parseDoctypedecl();

      document.doctype = doctype;

      document.children.push(doctype);
    }

    this.parseMisc();
  }

  /*
    [3] S ::= (#x20 | #x9 | #xD | #xA)+
  */
  private parseS(): string {
    return this.lexer.eatS();
  }

  /*
    [27] Misc ::= Comment | PI | S
  */
  private parseMisc(): void {
    const {
      lexer,
      parentNode: { children }
    } = this;

    while (lexer.hasData()) {
      this.parseS();

      if (lexer.matchString(COMMENT_START)) {
        children.push(this.parseComment());

        continue;
      }

      if (lexer.matchString(START_PROCESSING_INSTRUCTION)) {
        children.push(this.parsePI());

        continue;
      }

      break;
    }
  }

  /*
    [1] document ::= prolog element Misc*
  */
  private parseDocument(): DocumentNode {
    const { lexer } = this;

    const document: DocumentNode = {
      type: DOCUMENT_NODE,
      name: '#document',
      doctype: null,
      documentElement: null,
      characterSet: 'UTF-8',
      children: [],
      standalone: false,
      version: null
    };

    this.parentNode = document;

    this.parseProlog(document);

    if (!lexer.matchAndEat(LEFT_ANGLE_BRACKET))
      this.handleError(`Start tag expected, '<'.`);

    document.documentElement = this.parseElement();

    this.parseMisc();

    if (lexer.hasData())
      this.handleError('Extra content at the end of the document.');

    return document;
  }

  parse(): DocumentNode {
    return this.parseDocument();
  }
}
