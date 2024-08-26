// import {
//   CDATAStart,
//   CommentEnd,
//   CommentStart,
//   DoctypeStart,
//   DoubleHyphen,
//   EndProcessingInstruction,
//   Entities,
//   EntityDeclarationStart,
//   GlobalNamespaceURI,
//   NodeTypes,
//   StartEndTag,
//   StartProcessingInstruction,
//   TokenChars,
//   TokenCodes,
//   XMLDeclarationStart
// } from './src/constants';
// import { Lexer } from './src/lexer';
// import { ParserError } from './src/parser-error';
// import {
//   AttributeNode,
//   Attributes,
//   CDATASectionNode,
//   CommentNode,
//   DeclaredEntities,
//   DocumentNode,
//   DocumentTypeNode,
//   ElementNode,
//   Name,
//   ProcessingInstructionNode,
//   TextNode,
//   XMLDeclarationNode
// } from './src/types';

// const {
//   COMMENT_NODE,
//   DOCUMENT_NODE,
//   XML_DECLARATION_NODE,
//   ELEMENT_NODE,
//   PROCESSING_INSTRUCTION_NODE,
//   TEXT_NODE,
//   CDATA_SECTION_NODE,
//   DOCUMENT_TYPE_NODE,
//   ATTRIBUTE_NODE
// } = NodeTypes;

// export class XMLParser {
//   private lexer: Lexer;
//   private declaredEntities: DeclaredEntities;

//   private localNsMap: Map<string, string>;
//   private nsMap: Map<string, string>;
//   private supressErrors: boolean;
//   private parentNode: ElementNode | DocumentNode | null;

//   constructor(source: string, options: { supressErrors?: boolean } = {}) {
//     this.lexer = new Lexer(source);
//     this.declaredEntities = { ...Entities };
//     this.localNsMap = new Map<string, string>();
//     this.nsMap = new Map<string, string>();
//     this.supressErrors = options.supressErrors ?? false;
//     this.parentNode = null;
//   }

//   private handleError(message: string): never | void {
//     const { index, col, line, source } = this.lexer;

//     const parseError = new ParserError({
//       message,
//       index,
//       col,
//       line,
//       source
//     });

//     if (this.supressErrors) parseError;

//     throw parseError;
//   }

//   private getNamespaceURI(prefix: string): string | undefined {
//     return this.localNsMap.get(prefix) || this.nsMap.get(prefix);
//   }

//   private setLocalNamespaceURI(prefix: string, value: string): void {
//     this.localNsMap.set(prefix, value);
//   }

//   private isInTag = (): boolean =>
//     this.lexer.match(
//       (token) =>
//         token !== TokenCodes.RIGHT_ANGLE_BRACKET &&
//         token !== TokenCodes.SLASH &&
//         token !== TokenCodes.QUESTION_MARK
//     );

//   private isEndTag(): boolean {
//     const { lexer } = this;

//     return lexer.matchString(StartEndTag);
//   }

//   /*
//     [14] CharData ::= [^<&]* - ([^<&]* ']]>' [^<&]*)
//   */
//   private parseCharData(): string {
//     const { lexer } = this;

//     let output = '';

//     while (lexer.hasData()) {
//       const token = lexer.peek();

//       if (token === TokenCodes.LEFT_ANGLE_BRACKET) break;

//       if (token === TokenCodes.APOSTROPHE) output += this.parseEntityRef();
//       else output += lexer.next('char');
//     }

//     return output;
//   }

//   /*
//     [68] EntityRef ::= '&' Name ';'
//   */
//   private parseEntityRef(): string {
//     const { lexer } = this;

//     lexer.consumeApostrophe();

//     const { localName } = this.parseName();

//     lexer.consumeSemi();

//     const value = this.declaredEntities[`&${localName};`];

//     if (value === undefined)
//       this.handleError(`Entity "${localName}" is not defined.`);

//     return value;
//   }

//   private parseName(): Name {
//     const { lexer } = this;

//     const name = lexer.consumeName();

//     if (lexer.expect(TokenCodes.COLON)) {
//       lexer.consume();

//       const localName = lexer.consumeName();

//       return {
//         prefix: name,
//         localName,
//         name: `${name}:${localName}`
//       };
//     }

//     return {
//       localName: name,
//       name,
//       prefix: null
//     };
//   }

//   /*
//     [42] ETag ::= '</' Name S? '>'
//   */
//   private parseETag(tagName: string): void {
//     const { lexer } = this;

//     lexer.consumeStartEndTag();

//     const { name } = this.parseName();

//     if (name !== tagName)
//       this.handleError(`Unexpected closing tag: ${name} expected: ${tagName}`);

//     lexer.eatS();

//     lexer.consumeRightAngleBracket();
//   }

//   private parseAttributeValue(): string {
//     const { lexer } = this;

//     const quote = lexer.consumeQuote();

//     let output = '';

//     while (lexer.hasData()) {
//       const token = lexer.peek();

//       if (token === quote) break;

//       if (
//         token === TokenCodes.LEFT_ANGLE_BRACKET ||
//         token === TokenCodes.RIGHT_ANGLE_BRACKET
//       )
//         this.handleError(
//           `Unescaped "${String.fromCharCode(token)}" not allowed in attribute value.`
//         );

//       if (token === TokenCodes.APOSTROPHE) output += this.parseEntityRef();
//       else output += lexer.next('char');
//     }

//     /* Consume matching quote */

//     lexer.consume(quote);

//     return output;
//   }

//   private parseAttributes(ownerElement: ElementNode): Attributes {
//     const { lexer } = this;

//     const { attributes } = ownerElement;

//     const attributesWithNs: Record<string, string> = {};

//     while (lexer.eatS()) {
//       if (!this.isInTag()) break;

//       const attribute = this.parseAttribute(ownerElement);

//       const { prefix, name } = attribute;

//       if (prefix && prefix !== 'xmlns') attributesWithNs[prefix] = name;

//       attributes[name] = attribute;
//     }

//     for (const prop in attributesWithNs) {
//       const value = attributesWithNs[prop];

//       const namespaceURI = this.getNamespaceURI(prop);

//       if (!namespaceURI)
//         this.handleError(
//           `Namespace prefix "${prop}" for "${value}" is not defined.`
//         );

//       attributes[value].namespaceURI = namespaceURI;
//     }

//     return attributes;
//   }

//   /*
//     [25] Eq ::= S? '=' S?
//   */
//   private parseEq(): string {
//     const { lexer } = this;

//     return `${lexer.eatS()}${lexer.consumeEqual()}${lexer.eatS()}`;
//   }

//   private parseAttribute(ownerElement?: ElementNode): AttributeNode {
//     const { name, prefix, localName } = this.parseName();

//     this.parseEq();

//     const value = this.parseAttributeValue();

//     let namespaceURI = null;

//     if (name === 'xmlns') {
//       if (value === GlobalNamespaceURI.xml)
//         this.handleError('xml namespace URI cannot be the default namespace.');

//       this.setLocalNamespaceURI('', value);

//       namespaceURI = GlobalNamespaceURI.xmlns;
//     } else if (prefix === 'xmlns') {
//       if (localName === 'xml' && value !== GlobalNamespaceURI.xml)
//         this.handleError('xml namespace prefix mapped to wrong URI.');

//       if (value === GlobalNamespaceURI.xml)
//         this.handleError('xml namespace URI mapped to wrong prefix.');

//       if (value === GlobalNamespaceURI.xmlns)
//         this.handleError('Reuse of the xmlns namespace name is forbidden.');

//       if (value === '')
//         this.handleError('Empty namespace name is not allowed.');

//       this.setLocalNamespaceURI(localName, value);
//     }

//     return {
//       type: ATTRIBUTE_NODE,
//       name,
//       prefix,
//       localName,
//       value,
//       namespaceURI,
//       ownerElement
//     };
//   }

//   private parseCDSect(): CDATASectionNode {
//     const { lexer } = this;

//     lexer.consumeCDATAStart();

//     const value = lexer.consumeCData();

//     lexer.consumeCDATAEnd();

//     return {
//       type: CDATA_SECTION_NODE,
//       name: '#cdata-section',
//       data: value
//     };
//   }

//   /*
//     [32] SDDecl ::= S 'standalone' Eq (("'" ('yes' | 'no') "'") | ('"' ('yes' | 'no') '"'))
//   */
//   private parseSDDecl(): boolean {
//     const { lexer } = this;

//     this.parseEq();

//     const quote = lexer.consumeQuote();

//     const standalone = lexer.consumeWhile((token) => {
//       if (token === quote) return false;

//       return true;
//     });

//     lexer.consume(quote);

//     if (standalone === 'yes') return true;

//     if (standalone === 'no') return false;

//     this.handleError(`Only "yes" or "no" is allowed for standalone.`);
//   }

//   /*
//     [81] EncName ::= [A-Za-z] ([A-Za-z0-9._] | '-')*
//   */
//   private parseEncName(): string {
//     const { lexer } = this;

//     return lexer.consumeEncName();
//   }

//   /*
//     [80] EncodingDecl ::= S 'encoding' Eq ('"' EncName '"' | "'" EncName "'" )
//   */
//   private parseEncodingDecl(): string {
//     const { lexer } = this;

//     this.parseEq();

//     const quote = lexer.consumeQuote();

//     const encoding = this.parseEncName();

//     lexer.consume(quote);

//     return encoding;
//   }

//   /*
//     [26] VersionNum ::= '1.' [0-9]+
//   */
//   private parseVersionNum(): string {
//     const { lexer } = this;

//     const major = lexer.consumeDigit();

//     lexer.consumePeriod();

//     const minor = lexer.consumeDigits();

//     if (major !== '1')
//       this.handleError(`Unsupported version ${major}.${minor}`);

//     return `${major}.${minor}`;
//   }

//   /*
//     [24] VersionInfo ::= S 'version' Eq ("'" VersionNum "'" | '"' VersionNum '"')
//   */
//   private parseVersionInfo(): string {
//     const { lexer } = this;

//     lexer.consumeS();

//     if (lexer.consumeName() !== 'version')
//       this.handleError('Malformed xml declaration expecting version.');

//     this.parseEq();

//     const quote = lexer.consumeQuote();

//     const version = this.parseVersionNum();

//     lexer.consume(quote);

//     return version;
//   }

//   /*
//     [23] XMLDecl ::= '<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>'
//   */
//   private XMLDecl(): XMLDeclarationNode {
//     const { lexer } = this;

//     lexer.consumeXMLDeclarationStart();

//     const version = this.parseVersionInfo();

//     let standalone = false;
//     let encoding = 'UTF-8';

//     while (lexer.eatS()) {
//       if (!this.isInTag()) break;

//       const name = lexer.consumeName();

//       if (name === 'standalone') standalone = this.parseSDDecl();
//       else if (name === 'encoding') encoding = this.parseEncodingDecl();
//       else this.handleError(`${name} not allowed in XML declaration.`);
//     }

//     lexer.eatS();

//     lexer.consumeXMLDeclarationEnd();

//     return {
//       type: XML_DECLARATION_NODE,
//       name: '#xmlDeclaration',
//       version,
//       standalone,
//       encoding
//     };
//   }

//   /*
//     [14] Comment ::= '<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'
//   */
//   private parseComment(): CommentNode {
//     const { lexer } = this;

//     lexer.consumeCommentStart();

//     const data = lexer.consumeWhile((token) => {
//       if (lexer.matchString(CommentEnd)) return false;

//       if (lexer.matchString(DoubleHyphen))
//         this.handleError('Double hyphen within comment: <!--');

//       return lexer.isChar(token);
//     });

//     if (!lexer.matchString(CommentEnd))
//       this.handleError('Comment not terminated');

//     lexer.consumeCommentEnd();

//     return {
//       type: COMMENT_NODE,
//       name: '#comment',
//       data
//     };
//   }

//   /*
//     [17] PITarget ::= Name - (('X' | 'x') ('M' | 'm') ('L' | 'l'))
//   */
//   private parsePITarget(): string {
//     const { lexer } = this;

//     const name = lexer.consumeName();

//     if (name.toLowerCase() === 'xml')
//       this.handleError(
//         'xml is not allowed as a processing instruction target.'
//       );

//     return name;
//   }

//   /*
//     [16] PI ::= '<?' PITarget (S (Char* - (Char* '?>' Char*)))? '?>'
//   */
//   private parsePI(): ProcessingInstructionNode {
//     const { lexer } = this;

//     lexer.consumeStartProcessingInstruction();

//     const PITarget = this.parsePITarget();

//     lexer.eatS();

//     const data = lexer.consumeWhile((token) => {
//       if (lexer.matchString(EndProcessingInstruction)) return false;

//       if (!lexer.isChar(token))
//         this.handleError(
//           `Invalid character in Processing instruction ${String.fromCharCode(token)}.`
//         );

//       return true;
//     });

//     lexer.consumeEndProcessingInstruction();

//     return {
//       type: PROCESSING_INSTRUCTION_NODE,
//       target: PITarget,
//       data,
//       name: PITarget
//     };
//   }

//   /*
//     [43] content ::= CharData? ((element | Reference | CDSect | PI | Comment) CharData?)*
//   */
//   private parseContent(): void {
//     const { lexer } = this;

//     while (lexer.hasData()) {
//       if (this.isEndTag()) break;

//       this.parseElementChild();
//     }
//   }

//   /*
//     [39] element      ::= EmptyElemTag | STag content ETag
//     [12] STag	        ::= '<' QName (S Attribute)* S? '>'
//     [13] ETag	        ::= '</' QName S? '>'
//     [14] EmptyElemTag	::=  '<' QName (S Attribute)* S? '/>'
//   */
//   private parseElement(): ElementNode {
//     const { lexer, nsMap, localNsMap, parentNode } = this;

//     lexer.consumeLeftAngleBracket();

//     const { name, prefix, localName } = this.parseName();

//     const currentNsMap = nsMap;

//     localNsMap.clear();

//     const element: ElementNode = {
//       type: ELEMENT_NODE,
//       name,
//       prefix,
//       localName,
//       attributes: {},
//       children: [],
//       namespaceURI: null,
//       parentNode
//     };

//     parentNode.children.push(element);

//     this.parentNode = element;

//     element.attributes = this.parseAttributes(element);

//     this.nsMap = new Map([...currentNsMap, ...localNsMap]);

//     this.parseS();

//     const isEmptyTag = lexer.match(TokenCodes.SLASH);

//     if (isEmptyTag) lexer.consume();

//     lexer.consumeRightAngleBracket();

//     if (!isEmptyTag) {
//       this.parseContent();

//       this.parseETag(name);
//     }

//     /* Restore nsMap */

//     this.nsMap = currentNsMap;

//     if (prefix) {
//       const namespaceURI = this.getNamespaceURI(prefix);

//       if (!namespaceURI)
//         this.handleError(
//           `Namespace prefix "${prefix}" on element "${localName}" is not defined.`
//         );

//       element.namespaceURI = namespaceURI;
//     }

//     return element;
//   }

//   private parseTextNode(): TextNode {
//     const data = this.parseCharData();

//     return {
//       type: TEXT_NODE,
//       name: '#text',
//       data
//     };
//   }

//   private parseEntityValue(): string {
//     const { lexer } = this;

//     lexer.consumeDoubleQuote();

//     let output = '';

//     while (lexer.hasData()) {
//       const token = lexer.peek();

//       if (token === TokenCodes.DOUBLE_QUOTE) break;

//       if (token === TokenCodes.APOSTROPHE) output += this.parseEntityRef();
//       else output += lexer.next('char');
//     }

//     lexer.consumeDoubleQuote();

//     return output;
//   }

//   private parseEntityDeclaration(): void {
//     const { lexer } = this;

//     lexer.consumeEntityDeclarationStart();

//     lexer.consumeS();

//     const name = `&${this.parseName().name};`;

//     lexer.consumeS();

//     const value = this.parseEntityValue();

//     lexer.eatS();

//     lexer.consumeRightAngleBracket();

//     this.declaredEntities[name] = value;
//   }

//   private parseInternalSubset(): void {
//     const { lexer } = this;

//     lexer.consumeLeftAngleBracket();

//     while (lexer.hasData()) {
//       lexer.eatS();

//       if (lexer.matchString(TokenChars.RIGHT_ANGLE_BRACKET)) break;

//       if (lexer.matchString(EntityDeclarationStart)) {
//         this.parseEntityDeclaration();

//         continue;
//       }

//       this.handleError('Invalid internal subset in doctype declaration.');
//     }

//     lexer.consumeRightAngleBracket();
//   }

//   private parseDoctypedecl(): DocumentTypeNode {
//     const { lexer } = this;

//     lexer.consumeDoctypeStart();

//     lexer.eatS();

//     if (!lexer.isNameStartChar(lexer.peek()))
//       this.handleError('Doctype name is missing.');

//     const { name } = this.parseName();

//     lexer.eatS();

//     this.parseInternalSubset();

//     return {
//       type: DOCUMENT_TYPE_NODE,
//       name
//     };
//   }

//   private parseElementChild():
//     | CDATASectionNode
//     | CommentNode
//     | ElementNode
//     | TextNode
//     | ProcessingInstructionNode {
//     const { lexer } = this;

//     if (lexer.matchString(CDATAStart)) return this.parseCDSect();

//     if (lexer.matchString(CommentStart)) return this.parseComment();

//     if (lexer.matchString(StartProcessingInstruction)) return this.parsePI();

//     if (lexer.matchString(TokenChars.LEFT_ANGLE_BRACKET))
//       return this.parseElement();

//     if (!lexer.expect(TokenCodes.RIGHT_ANGLE_BRACKET))
//       return this.parseTextNode();

//     this.handleError(
//       `Unexpected character: ${String.fromCharCode(lexer.peek())}`
//     );
//   }
//   /*
//     [22] prolog ::= XMLDecl? Misc* (doctypedecl Misc*)?
//   */
//   private parseProlog(document: DocumentNode) {
//     const { lexer } = this;

//     if (lexer.matchString(XMLDeclarationStart)) {
//       if (lexer.index > 0)
//         this.handleError('XML declaration only allowed at start of document.');

//       const { encoding, standalone, version } = this.XMLDecl();

//       document.characterSet = encoding;
//       document.standalone = standalone;
//       document.version = version;
//     }

//     this.parseMisc();

//     if (lexer.matchString(DoctypeStart)) {
//       if (document.documentElement)
//         this.handleError('DOCTYPE only alowed before root element.');

//       if (document.doctype) this.handleError('DOCTYPE already declared.');

//       const doctype = this.parseDoctypedecl();

//       document.doctype = doctype;

//       document.children.push(doctype);
//     }

//     this.parseMisc();
//   }

//   /*
//     [3] S ::= (#x20 | #x9 | #xD | #xA)+
//   */
//   private parseS(): void {
//     this.lexer.eatS();
//   }

//   /*
//     [27] Misc ::= Comment | PI | S
//   */
//   private parseMisc(): void {
//     const {
//       lexer,
//       parentNode: { children }
//     } = this;

//     while (lexer.hasData()) {
//       this.parseS();

//       if (lexer.matchString(CommentStart)) {
//         children.push(this.parseComment());

//         continue;
//       }

//       if (lexer.matchString(StartProcessingInstruction)) {
//         children.push(this.parsePI());

//         continue;
//       }

//       break;
//     }
//   }

//   /*
//     [1] document ::= prolog element Misc*
//   */
//   private parseDocument(): DocumentNode {
//     const { lexer } = this;

//     const document: DocumentNode = {
//       type: DOCUMENT_NODE,
//       name: '#document',
//       doctype: null,
//       documentElement: null,
//       characterSet: 'UTF-8',
//       children: [],
//       standalone: false,
//       version: null
//     };

//     this.parentNode = document;

//     this.parseProlog(document);

//     if (!lexer.expect(TokenCodes.LEFT_ANGLE_BRACKET))
//       this.handleError(`Start tag expected, '<'.`);

//     document.documentElement = this.parseElement();

//     this.parseMisc();

//     if (lexer.hasData())
//       this.handleError('Extra content at the end of the document.');

//     return document;
//   }

//   parse(): DocumentNode {
//     return this.parseDocument();
//   }
// }
