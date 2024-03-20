export const Entities = {
  '&quot;': '"',
  '&amp;': '&',
  '&apos;': "'",
  '&lt;': '<',
  '&gt;': '>'
} as const;

export const GlobalNamespaceURI = {
  // The HTML namespace is "http://www.w3.org/1999/xhtml".
  html: 'http://www.w3.org/1999/xhtml',
  // The MathML namespace is "http://www.w3.org/1998/Math/MathML".
  mathML: 'http://www.w3.org/1998/Math/MathML',
  // The SVG namespace is "http://www.w3.org/2000/svg".
  svg: 'http://www.w3.org/2000/svg',
  // The XLink namespace is "http://www.w3.org/1999/xlink".
  xLink: 'http://www.w3.org/1999/xlink',
  // The XML namespace is "http://www.w3.org/XML/1998/namespace".
  xml: 'http://www.w3.org/XML/1998/namespace',
  // The XMLNS namespace is "http://www.w3.org/2000/xmlns/".
  xmlns: 'http://www.w3.org/2000/xmlns/'
} as const;

export const GlobalNamespace = {
  html: 'html',
  mathML: 'mathml',
  svg: 'svg',
  xLink: 'xlink',
  xml: 'xml',
  xmlns: 'xmlns'
} as const;

export const NodeTypes = {
  ELEMENT_NODE: 1,
  ATTRIBUTE_NODE: 2,
  TEXT_NODE: 3,
  CDATA_SECTION_NODE: 4,
  PROCESSING_INSTRUCTION_NODE: 7,
  COMMENT_NODE: 8,
  DOCUMENT_NODE: 9,
  DOCUMENT_TYPE_NODE: 10,
  DOCUMENT_FRAGMENT_NODE: 11,
  XML_DECLARATION_NODE: 12
} as const;

export const Tokens = {
  EOF: '\x00',
  CAPITAL_A: 'A',
  CAPITAL_Z: 'Z',
  LOWER_CASE_A: 'a',
  LOWER_CASE_Z: 'z',
  LEFT_ANGLE_BRACKET: '<',
  RIGHT_ANGLE_BRACKET: '>',
  EQUAL: '=',
  SEMI: ';',
  COLON: ':',
  QUESTION_MARK: '?',
  EXCLAMATION_MARK: '!',
  VERTICAL_BAR: '|',
  HYPHEN: '-',
  LEFT_SQUARE_BRACKET: '[',
  RIGHT_SQUARE_BRACKET: ']',
  UNDERSCORE: '_',
  PERIOD: '.',
  SLASH: '/',
  APOSTROPHE: '&',
  SINGLE_QUOTE: "'",
  DOUBLE_QUOTE: '"',
  PERCENT: '%',
  NEWLINE: '\n',
  CARRIAGE_RETURN: '\r',
  TAB: '\t',
  WHITE_SPACE: ' ',
  CDATA_START: '<![CDATA[',
  CDATA_END: ']]>',
  COMMENT_START: '<!--',
  COMMENT_END: '-->',
  DOUBLE_HYPHEN: '--',
  DOCTYPE_START: '<!DOCTYPE',
  XML_DECLARATION_START: '<?xml',
  XML_DECLARATION_END: '?>',
  ENTITY_DECLARATION_START: '<!ENTITY',
  START_END_TAG: '</',
  START_PROCESSING_INSTRUCTION: '<?',
  END_PROCESSING_INSTRUCTION: '?>'
} as const;

export const CharCodes = {
  EOF: 0x0,
  LEFT_ANGLE_BRACKET: 0x3c,
  RIGHT_ANGLE_BRACKET: 0x3e,
  EQUAL: 0x3d,
  SEMI: 0x3b,
  COLON: 0x3a,
  QUESTION_MARK: 0x3f,
  EXCLAMATION_MARK: 0x21,
  VERTICAL_BAR: 0x7c,
  MIDDLE_DOT: 0xb7,
  HYPHEN: 0x2d,
  LEFT_SQUARE_BRACKET: 0x5b,
  RIGHT_SQUARE_BRACKET: 0x5d,
  UNDERSCORE: 0x5f,
  PERIOD: 0x2e,
  SLASH: 0x2f,
  APOSTROPHE: 0x26,
  SINGLE_QUOTE: 0x27,
  DOUBLE_QUOTE: 0x22,
  PERCENT: 0x25,
  NEWLINE: 0xa,
  CARRIAGE_RETURN: 0xd,
  TAB: 0x9,
  WHITE_SPACE: 0x20,
  CAPITAL_A: 0x41,
  CAPITAL_Z: 0x5a,
  LOWER_CASE_A: 0x61,
  LOWER_CASE_Z: 0x7a,
  ZERO: 0x30,
  NINE: 0x39,
  LATIN_CAPITAL_LETTER_A_WITH_GRAVE: 0xc0,
  LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS: 0xd6,
  LATIN_CAPITAL_LETTER_O_WITH_STROKE: 0xd8,
  LATIN_SMALL_LETTER_O_WITH_DIAERESIS: 0xf6,
  LATIN_SMALL_LETTER_O_WITH_STROKE: 0xf8,
  MODIFIER_LETTER_LOW_LEFT_ARROW: 0x2ff,
  GREEK_CAPITAL_LETTER_HETA: 0x370,
  GREEK_SMALL_REVERSED_DOTTED_LUNATE_SIGMA_SYMBOL: 0x37d,
  HIGH_SURROGATE_START: 0xd800,
  LOW_SURROGATE_END: 0xdfff,
  GREEK_DASIA: 0x1fff,
  SUPERSCRIPT_ZERO: 0x2070,
  NUMBER_FORM_END: 0x218f,
  GLAGOLITIC_CAPITAL_LETTER_AZU: 0x2c00,
  IDEOGRAPHIC_COMMA: 0x3001,
  HANGUL_JAMO_EXTENDE_B_END: 0xd7ff,
  BMP_UNALLOCATED_END: 0x2fef,
  CJK_COMPATIBILITY_IDEOGRAPH_START: 0xf900,
  ARABIC_LIGATURE_SALAAMUHU_ALAYNAA: 0xfdcf,
  ARABIC_LIGATURE_SALLA_USED_AS_KORANIC_STOP_SIGN_ISOLATED_FORM: 0xfdf0,
  REPLACEMENT_CHARACTER: 0xfffd,
  LINEAR_B_SYLLABLE_B008_A: 0x10000,
  NOT_A_CHARACTER: 0xeffff,
  COMBINING_GRAVE_ACCENT: 0x300,
  COMBINING_LATIN_SMALL_LETTER_X: 0x36f,
  UNDERTIE: 0x203f,
  ZERO_WIDTH_NON_JOINER: 0x200c,
  ZERO_WIDTH_JOINER: 0x200d,
  CHARACTER_TIE: 0x2040
} as const;
