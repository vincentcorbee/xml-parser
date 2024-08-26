export type ELEMENT_NODE = 1;
export type ATTRIBUTE_NODE = 2;
export type TEXT_NODE = 3;
export type CDATA_SECTION_NODE = 4;
export type PROCESSING_INSTRUCTION_NODE = 7;
export type COMMENT_NODE = 8;
export type DOCUMENT_NODE = 9;
export type DOCUMENT_TYPE_NODE = 10;
export type DOCUMENT_FRAGMENT_NODE = 11;
export type XML_DECLARATION_NODE = 12;

export type QName = {
  localName: string;
  name: string;
  prefix: null | string;
};

export type Node = {
  parentNode: ElementNode | DocumentNode | null;
};

export type AttributeNode = Node & {
  type: ATTRIBUTE_NODE;
  name: string;
  localName: string;
  prefix?: string;
  value: string;
  namespaceURI?: string;
  ownerElement?: ElementNode;
};

export type Attributes = Record<string, AttributeNode>;

export type DocumentNode = Node & {
  type: DOCUMENT_NODE;
  name: '#document';
  documentElement: ElementNode | null;
  doctype: DocumentTypeNode | null;
  version: string | null;
  standalone: boolean;
  characterSet: string;
  children: Omit<XMLNode, 'DocumentNode'>[];
};

export type ProcessingInstructionNode = Node & {
  type: PROCESSING_INSTRUCTION_NODE;
  name: string;
  data: string;
  target: string;
};

export type CDATASectionNode = Node & {
  type: CDATA_SECTION_NODE;
  name: '#cdata-section';
  data: string;
};

export type DocumentTypeNode = Node & {
  type: DOCUMENT_TYPE_NODE;
  name: string;
};

export type XMLDeclarationNode = {
  type: XML_DECLARATION_NODE;
  name: '#xmlDeclaration';
  version: string;
  encoding: string;
  standalone: boolean;
};

export type TextNode = Node & {
  type: TEXT_NODE;
  name: '#text';
  data: string;
};

export type CommentNode = Node & {
  type: COMMENT_NODE;
  name: '#comment';
  data: string;
};

export type ElementNode = Node & {
  type: ELEMENT_NODE;
  name: string;
  localName: string;
  prefix?: string;
  attributes: Attributes;
  children: XMLNode[];
  namespaceURI?: string;
};

export type XMLNode =
  | DocumentNode
  | CommentNode
  | TextNode
  | XMLDeclarationNode
  | CDATASectionNode
  | ElementNode
  | AttributeNode
  | DocumentTypeNode
  | ProcessingInstructionNode;

export type Enter<
  T extends Exclude<XMLNode, XMLDeclarationNode | DocumentNode>
> = (params: {
  node: T;
  result: any;
  parent?: XMLNode;
  visitors: Vistors;
  traverse: any;
}) => any;

export type ElementVisitor = {
  enter: Enter<ElementNode>;
};

export type TextVistor = {
  enter: Enter<TextNode>;
};

export type CommentVistor = {
  enter: Enter<CommentNode>;
};

export type CDATAVistor = {
  enter: Enter<CDATASectionNode>;
};

export type AttributeVistor = {
  enter: Enter<AttributeNode>;
};

export type Vistors = {
  tag: ElementVisitor;
  emptyTag: ElementVisitor;
  comment: CommentVistor;
  text: TextVistor;
  cdata: CDATAVistor;
  attribute: AttributeVistor;
};

export type DeclaredEntities = {
  [key: string]: string;
};
