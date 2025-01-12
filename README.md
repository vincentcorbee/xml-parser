## Grammar

Document
[1] document ::= prolog element Misc\*

Character Range
[2] Char ::= #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF] /_ any Unicode character, excluding the surrogate blocks, FFFE, and FFFF. _/

White Space
[3] S ::= (#x20 | #x9 | #xD | #xA)+

Names and Tokens
[4] NameStartChar ::= ":" | [A-Z] | "\_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] | [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
[4a] NameChar ::= NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] | [#x203F-#x2040]
[5] Name ::= NameStartChar (NameChar)_
[6] Names ::= Name (#x20 Name)_
[7] Nmtoken ::= (NameChar)+
[8] Nmtokens ::= Nmtoken (#x20 Nmtoken)\*

Literals
[9] EntityValue ::= '"' ([^%&"] | PEReference | Reference)_ '"'
| "'" ([^%&'] | PEReference | Reference)_ "'"
[10] AttValue ::= '"' ([^<&"] | Reference)_ '"'
| "'" ([^<&'] | Reference)_ "'"
[11] SystemLiteral ::= ('"' [^"]_ '"') | ("'" [^']_ "'")
[12] PubidLiteral ::= '"' PubidChar* '"' | "'" (PubidChar - "'")* "'"
[13] PubidChar ::= #x20 | #xD | #xA | [a-zA-Z0-9] | [-'()+,./:=?;!*#@$_%]

Character Data
[14] CharData ::= [^<&]_ - ([^<&]_ ']]>' [^<&]\*)

Comments
[15] Comment ::= '<!--' ((Char - '-') | ('-' (Char - '-')))* '-->'

Processing Instructions
[16] PI ::= '<?' PITarget (S (Char* - (Char* '?>' Char\*)))? '?>'
[17] PITarget ::= Name - (('X' | 'x') ('M' | 'm') ('L' | 'l'))

CDATA Sections
[18] CDSect ::= CDStart CData CDEnd
[19] CDStart ::= '<![CDATA['
[20]   	CData	   ::=   	(Char* - (Char* ']]>' Char\*))
[21] CDEnd ::= ']]>'

Prolog
[22] prolog ::= XMLDecl? Misc* (doctypedecl Misc*)?
[23] XMLDecl ::= '<?xml' VersionInfo EncodingDecl? SDDecl? S? '?>'
[24] VersionInfo ::= S 'version' Eq ("'" VersionNum "'" | '"' VersionNum '"')
[25] Eq ::= S? '=' S?
[26] VersionNum ::= '1.' [0-9]+
[27] Misc ::= Comment | PI | S

Document Type Definition
[28] doctypedecl ::= '<!DOCTYPE' S Name (S ExternalID)? S? ('[' intSubset ']' S?)? '>'
[28a] DeclSep ::= PEReference | S
[28b] intSubset ::= (markupdecl | DeclSep)\*
[29] markupdecl ::= elementdecl | AttlistDecl | EntityDecl | NotationDecl | PI | Comment

External Subset
[30] extSubset ::= TextDecl? extSubsetDecl
[31] extSubsetDecl ::= ( markupdecl | conditionalSect | DeclSep)\*

Standalone Document Declaration
[32] SDDecl ::= S 'standalone' Eq (("'" ('yes' | 'no') "'") | ('"' ('yes' | 'no') '"'))

Element
[39] element ::= EmptyElemTag
| STag content ETag

Start-tag
[40] STag ::= '<' Name (S Attribute)\* S? '>'
[41] Attribute ::= Name Eq AttValue

End-tag
[42] ETag ::= '</' Name S? '>'

Content of Elements
[43] content ::= CharData? ((element | Reference | CDSect | PI | Comment) CharData?)\*

Tags for Empty Elements
[44] EmptyElemTag ::= '<' Name (S Attribute)\* S? '/>'

Element Type Declaration
[45] elementdecl ::= '<!ELEMENT' S Name S contentspec S? '>'
[46] contentspec ::= 'EMPTY' | 'ANY' | Mixed | children

Element-content Models
[47] children ::= (choice | seq) ('?' | '_' | '+')?
[48] cp ::= (Name | choice | seq) ('?' | '_' | '+')?
[49] choice ::= '(' S? cp ( S? '|' S? cp )+ S? ')'
[50] seq ::= '(' S? cp ( S? ',' S? cp )\* S? ')'

Mixed-content Declaration
[51] Mixed ::= '(' S? '#PCDATA' (S? '|' S? Name)_ S? ')_'
| '(' S? '#PCDATA' S? ')'

Attribute-list Declaration
[52] AttlistDecl ::= '<!ATTLIST' S Name AttDef\* S? '>'
[53] AttDef ::= S Name S AttType S DefaultDecl

Attribute Types
[54] AttType ::= StringType | TokenizedType | EnumeratedType
[55] StringType ::= 'CDATA'
[56] TokenizedType ::= 'ID'
| 'IDREF'
| 'IDREFS'
| 'ENTITY'
| 'ENTITIES'
| 'NMTOKEN'
| 'NMTOKENS'

Enumerated Attribute Types
[57] EnumeratedType ::= NotationType | Enumeration
[58] NotationType ::= 'NOTATION' S '(' S? Name (S? '|' S? Name)_ S? ')'
[59] Enumeration ::= '(' S? Nmtoken (S? '|' S? Nmtoken)_ S? ')'

Attribute Defaults
[60] DefaultDecl ::= '#REQUIRED' | '#IMPLIED'
| (('#FIXED' S)? AttValue)

Conditional Section
[61] conditionalSect ::= includeSect | ignoreSect
[62] includeSect ::= '<![' S? 'INCLUDE' S? '[' extSubsetDecl ']]>'
[63] ignoreSect ::= '<![' S? 'IGNORE' S? '[' ignoreSectContents* ']]>
[64] ignoreSectContents ::= Ignore ('<![' ignoreSectContents ']]>' Ignore)_
[65] Ignore ::= Char_ - (Char* ('<![' | ']]>') Char*)

Character Reference
[66] CharRef ::= '&#' [0-9]+ ';'
| '&#x' [0-9a-fA-F]+ ';'

Entity Reference
[67] Reference ::= EntityRef | CharRef
[68] EntityRef ::= '&' Name ';'
[69] PEReference ::= '%' Name ';'

Entity Declaration
[70] EntityDecl ::= GEDecl | PEDecl
[71] GEDecl ::= '<!ENTITY' S Name S EntityDef S? '>'
[72] PEDecl ::= '<!ENTITY' S '%' S Name S PEDef S? '>'
[73] EntityDef ::= EntityValue | (ExternalID NDataDecl?)
[74] PEDef ::= EntityValue | ExternalID

External Entity Declaration
75 ExternalID ::= 'SYSTEM' S SystemLiteral | 'PUBLIC' S PubidLiteral S SystemLiteral
76 NDataDecl ::= S 'NDATA' S Name

Text Declaration
[77] TextDecl ::= '<?xml' VersionInfo? EncodingDecl S? '?>'

Well-Formed External Parsed Entity
[78] extParsedEnt ::= TextDecl? content

Encoding Declaration
[80] EncodingDecl ::= S 'encoding' Eq ('"' EncName '"' | "'" EncName "'" )
[81] EncName ::= [A-Za-z] ([A-Za-z0-9._] | '-')\*

Notation Declarations
[82] NotationDecl ::= '<!NOTATION' S Name S (ExternalID | PublicID) S? '>'
[83] PublicID ::= 'PUBLIC' S PubidLiteral
