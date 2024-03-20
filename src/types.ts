export type AttributeNode = {
  type: 'attribute';
  name: string;
  value: any;
  raw: string;
};

export type Attributes = Record<string, AttributeNode>;

export type DocumentNode = {
  type: 'document';
  name: '#document';
  xmlDeclaration: XMLDeclarationNode | null;
  root: XMLNode | null;
  docType: DocTypeNode | null;
};

export type CDATANode = {
  type: 'cdata';
  name: '#cdata';
  value: string;
  raw: string;
};

export type DocTypeNode = {
  type: 'doctype';
  name: '#doctype';
  raw: string;
};

export type XMLDeclarationNode = {
  type: 'xmlDeclaration';
  name: '#declaration';
  raw: string;
  version: AttributeNode;
  standalone: AttributeNode;
  attrs: Attributes;
};

export type TextNode = {
  type: 'text';
  name: '#text';
  value: string;
};

export type CommentNode = {
  type: 'comment';
  name: '#comment';
  value: string;
};

export type TagNode = {
  type: 'tag' | 'emptyTag';
  name: string;
  attrs: Attributes;
  children: XMLNode[];
};

export type XMLNode =
  | DocumentNode
  | CommentNode
  | TextNode
  | XMLDeclarationNode
  | CDATANode
  | TagNode
  | AttributeNode
  | DocTypeNode;

export type StackNode = {
  node: XMLNode | null;
  parentNode: TagNode | null;
  indexNode: number;
};

export type Enter<
  T extends Exclude<XMLNode, XMLDeclarationNode | DocumentNode>
> = (params: {
  node: T;
  result: any;
  parent?: XMLNode;
  visitors: Vistors;
  traverse: any;
}) => any;

export type TagVistor = {
  enter: Enter<TagNode>;
};

export type TextVistor = {
  enter: Enter<TextNode>;
};

export type CommentVistor = {
  enter: Enter<CommentNode>;
};

export type CDATAVistor = {
  enter: Enter<CDATANode>;
};

export type AttributeVistor = {
  enter: Enter<AttributeNode>;
};

export type Vistors = {
  tag: TagVistor;
  emptyTag: TagVistor;
  comment: CommentVistor;
  text: TextVistor;
  cdata: CDATAVistor;
  attribute: AttributeVistor;
};

export type DeclaredEntities = {
  [key: string]: string;
};
