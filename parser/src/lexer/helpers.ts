import { CharCodes, Tokens } from '../constants';

const {
  CAPITAL_A,
  CAPITAL_Z,
  LOWER_CASE_A,
  LOWER_CASE_Z,
  ZERO,
  NINE,
  MIDDLE_DOT,
  COMBINING_GRAVE_ACCENT,
  COMBINING_LATIN_SMALL_LETTER_X,
  UNDERTIE,
  CHARACTER_TIE,
  LATIN_CAPITAL_LETTER_A_WITH_GRAVE,
  LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS,
  LATIN_CAPITAL_LETTER_O_WITH_STROKE,
  LATIN_SMALL_LETTER_O_WITH_DIAERESIS,
  LATIN_SMALL_LETTER_O_WITH_STROKE,
  MODIFIER_LETTER_LOW_LEFT_ARROW,
  GREEK_CAPITAL_LETTER_HETA,
  GREEK_SMALL_REVERSED_DOTTED_LUNATE_SIGMA_SYMBOL,
  ZERO_WIDTH_NON_JOINER,
  ZERO_WIDTH_JOINER,
  SUPERSCRIPT_ZERO,
  NUMBER_FORM_END,
  GLAGOLITIC_CAPITAL_LETTER_AZU,
  BMP_UNALLOCATED_END,
  IDEOGRAPHIC_COMMA,
  HANGUL_JAMO_EXTENDE_B_END,
  CJK_COMPATIBILITY_IDEOGRAPH_START,
  ARABIC_LIGATURE_SALAAMUHU_ALAYNAA,
  REPLACEMENT_CHARACTER,
  LINEAR_B_SYLLABLE_B008_A,
  NOT_A_CHARACTER,
  ARABIC_LIGATURE_SALLA_USED_AS_KORANIC_STOP_SIGN_ISOLATED_FORM,
  GREEK_DASIA,
  HIGH_SURROGATE_START,
  LOW_SURROGATE_END
} = CharCodes;

const {
  WHITE_SPACE,
  TAB,
  NEWLINE,
  CARRIAGE_RETURN,
  RIGHT_ANGLE_BRACKET,
  SLASH,
  COLON,
  HYPHEN,
  PERIOD,
  UNDERSCORE,
  QUESTION_MARK
} = Tokens;

export const isChar = (char: string): boolean => {
  const code = char.charCodeAt(0);

  if (code === 0xfffe || code === 0xffff) return false;

  if (char.length > 1) return true;

  /* Any character except UTF-16 surrogate pairs */
  if (code < HIGH_SURROGATE_START || code > LOW_SURROGATE_END) return true;

  return false;
};

export const isDigit = (char: string): boolean => {
  const token = char.charCodeAt(0);

  return token >= ZERO && token <= NINE;
};

export const isLetter = (char: string): boolean => {
  const token = char.charCodeAt(0);

  if (token >= CAPITAL_A && token <= CAPITAL_Z) return true;
  if (token >= LOWER_CASE_A && token <= LOWER_CASE_Z) return true;

  return false;
};

export const isNCNameChar = (token: string): boolean => {
  if (token === COLON) return false;

  return isNameChar(token);
};

export const isNameChar = (token: string): boolean => {
  if (isNameStartChar(token)) return true;

  if (token === HYPHEN) return true;
  if (token === PERIOD) return true;

  const code = token.charCodeAt(0);

  if (code >= ZERO && code <= NINE) return true;
  if (code === MIDDLE_DOT) return true;
  if (code >= COMBINING_GRAVE_ACCENT && code <= COMBINING_LATIN_SMALL_LETTER_X)
    return true;
  if (code >= UNDERTIE && code <= CHARACTER_TIE) return true;

  return false;
};

export const isNameStartChar = (token: string): boolean => {
  if (isLetter(token)) return true;

  if (token === COLON) return true;
  if (token === UNDERSCORE) return true;

  const code = token.charCodeAt(0);

  if (
    code >= LATIN_CAPITAL_LETTER_A_WITH_GRAVE &&
    code <= LATIN_CAPITAL_LETTER_O_WITH_DIAERESIS
  )
    return true;
  if (
    code >= LATIN_CAPITAL_LETTER_O_WITH_STROKE &&
    code <= LATIN_SMALL_LETTER_O_WITH_DIAERESIS
  )
    return true;
  if (
    code >= LATIN_SMALL_LETTER_O_WITH_STROKE &&
    code <= MODIFIER_LETTER_LOW_LEFT_ARROW
  )
    return true;
  if (
    code >= GREEK_CAPITAL_LETTER_HETA &&
    code <= GREEK_SMALL_REVERSED_DOTTED_LUNATE_SIGMA_SYMBOL
  )
    return true;
  if (
    code >= GREEK_SMALL_REVERSED_DOTTED_LUNATE_SIGMA_SYMBOL &&
    code <= GREEK_DASIA
  )
    return true;
  if (code >= ZERO_WIDTH_NON_JOINER && code <= ZERO_WIDTH_JOINER) return true;
  if (code >= SUPERSCRIPT_ZERO && code <= NUMBER_FORM_END) return true;
  if (code >= GLAGOLITIC_CAPITAL_LETTER_AZU && code <= BMP_UNALLOCATED_END)
    return true;
  if (code >= IDEOGRAPHIC_COMMA && code <= HANGUL_JAMO_EXTENDE_B_END)
    return true;
  if (
    code >= CJK_COMPATIBILITY_IDEOGRAPH_START &&
    code <= ARABIC_LIGATURE_SALAAMUHU_ALAYNAA
  )
    return true;
  if (
    code >= ARABIC_LIGATURE_SALLA_USED_AS_KORANIC_STOP_SIGN_ISOLATED_FORM &&
    code <= REPLACEMENT_CHARACTER
  )
    return true;
  if (code >= LINEAR_B_SYLLABLE_B008_A && code <= NOT_A_CHARACTER) return true;

  return false;
};

export const isEncNameChar = (token: string): boolean => {
  if (isLetter(token)) return true;
  if (isDigit(token)) return true;
  if (token === PERIOD) return true;
  if (token === HYPHEN) return true;
  if (token === UNDERSCORE) return true;

  return false;
};

export const isS = (token: string): boolean => {
  if (token === WHITE_SPACE) return true;
  if (token === TAB) return true;
  if (token === CARRIAGE_RETURN) return true;
  if (token === NEWLINE) return true;

  return false;
};

export const isInTag = (token: string) => {
  if (token === RIGHT_ANGLE_BRACKET) return false;
  if (token === SLASH) return false;
  if (token === QUESTION_MARK) return false;

  return true;
};
