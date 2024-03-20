import {
  AttributeVistor,
  CDATAVistor,
  CommentVistor,
  TagVistor,
  TextVistor,
  Vistors
} from './types';

const S = `\\s`;
const Name = '([A-z_]+[A-z_.0-9-]*:)?([A-z_]+[A-z_.0-9-]*)';
const EntityDef = '([^>]+?)';

const elementdecl = `<!ELEMENT >`;
const GEDeclaration = `<!ENTITY${S}*${Name}${S}*${EntityDef}${S}*>`;
const constentspec = ``;
const markupdecl = `${GEDeclaration}`;
const intSubset = `(${markupdecl})*`;

const doctypedecl = `^<!DOCTYPE${S}*${Name}${S}*(\\[[^]*?])?${S}*>`;
const STag = `^<${Name}${S}*([^>]+?)?${S}*(\\/)?${S}*>`;
const ETag = `^<\\/${Name}${S}*>`;
const Attribute = `([A-z_:]+[:A-z_.0-9]*)${S}*(?:(=)${S}*(("[^"]*")|('[^']*'))?)?`;
const EntityRef = `&${Name};`;
const DanglingAmp = `&(?!${Name};)`;

export const doctypeRegExp = new RegExp(doctypedecl);

export const attrRegExp = new RegExp(Attribute, 'g');

export const GEDeclarationRegExp = new RegExp(`^${GEDeclaration}`);

export const xmlDeclarationRegExp = /^<\?xml([^>]+)\?>/;

export const startTagRegExp = new RegExp(STag);

export const entityRefRegExp = new RegExp(EntityRef, 'g');

export const danglingAmpRegExp = new RegExp(DanglingAmp);

export const endTagRegExp = new RegExp(ETag);

export const commentRegExp = /^<!--([\s\S]*?)-->/;

export const contentRegExp = /^[^<]+(?=<)/;

export const CDATARegExp = /^<!\[CDATA\[([\s\S]*)]]>/;

export const linesRegExp = /[\n\r]/g;

export const whiteSpaceRegExp = new RegExp(`^${S}`);

export const MatchingPatterns = [
  attrRegExp,
  CDATARegExp,
  commentRegExp,
  contentRegExp,
  endTagRegExp,
  linesRegExp,
  startTagRegExp,
  xmlDeclarationRegExp,
  GEDeclarationRegExp,
  entityRefRegExp,
  whiteSpaceRegExp,
  doctypeRegExp
];

export const Entities = {
  '&quot;': '"',
  '&amp;': '&',
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>'
};
