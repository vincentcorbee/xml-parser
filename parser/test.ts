import { generateCode } from './src/helpers/generate-code';
import { Lexer } from './src/lexer/lexer';
import { XMLParser } from './src/parser';
import { DOMParser } from '@xmldom/xmldom';

const xml1 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<catalog>
   <book id="bk101">
      <author>𐐷 Gambardella, Matthew</author>
      <title>XML Developer's Guide</title>
      <genre>Computer</genre>
      <price>44.95</price>
      <publish_date>2000-10-01</publish_date>
      <description>An in-depth look at creating applications
      with XML.</description>
   </book>
   <book id="bk102">
      <author>Ralls, Kim</author>
      <title>Midnight Rain</title>
      <genre>Fantasy</genre>
      <price>5.95</price>
      <publish_date>2000-12-16</publish_date>
      <description>A former architect battles corporate zombies,
      an evil sorceress, and her own childhood to become queen
      of the world.</description>
   </book>
   <book id="bk103">
      <author>Corets, Eva</author>
      <title>Maeve Ascendant</title>
      <genre>Fantasy</genre>
      <price>5.95</price>
      <publish_date>2000-11-17</publish_date>
      <description>After the collapse of a nanotechnology
      society in England, the young survivors lay the
      foundation for a new society.</description>
   </book>
   <book id="bk104">
      <author>Corets, Eva</author>
      <title>Oberon's Legacy</title>
      <genre>Fantasy</genre>
      <price>5.95</price>
      <publish_date>2001-03-10</publish_date>
      <description>In post-apocalypse England, the mysterious
      agent known only as Oberon helps to create a new life
      for the inhabitants of London. Sequel to Maeve
      Ascendant.</description>
   </book>
   <book id="bk105">
      <author>Corets, Eva</author>
      <title>The Sundered Grail</title>
      <genre>Fantasy</genre>
      <price>5.95</price>
      <publish_date>2001-09-10</publish_date>
      <description>The two daughters of Maeve, half-sisters,
      battle one another for control of England. Sequel to
      Oberon's Legacy.</description>
   </book>
   <book id="bk106">
      <author>Randall, Cynthia</author>
      <title>Lover Birds</title>
      <genre>Romance</genre>
      <price>4.95</price>
      <publish_date>2000-09-02</publish_date>
      <description>When Carla meets Paul at an ornithology
      conference, tempers fly as feathers get ruffled.</description>
   </book>
   <book id="bk107">
      <author>Thurman, Paula</author>
      <title>Splish Splash</title>
      <genre>Romance</genre>
      <price>4.95</price>
      <publish_date>2000-11-02</publish_date>
      <description>A deep sea diver finds true love twenty
      thousand leagues beneath the sea.</description>
   </book>
   <book id="bk108">
      <author>Knorr, Stefan</author>
      <title>Creepy Crawlies</title>
      <genre>Horror</genre>
      <price>4.95</price>
      <publish_date>2000-12-06</publish_date>
      <description>An anthology of horror stories about roaches,
      centipedes, scorpions  and other insects.</description>
   </book>
   <book id="bk109">
      <author>Kress, Peter</author>
      <title>Paradox Lost</title>
      <genre>Science Fiction</genre>
      <price>6.95</price>
      <publish_date>2000-11-02</publish_date>
      <description>After an inadvertant trip through a Heisenberg
      Uncertainty Device, James Salway discovers the problems
      of being quantum.</description>
   </book>
   <book id="bk110">
      <author>O'Brien, Tim</author>
      <title>Microsoft .NET: The Programming Bible</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-09</publish_date>
      <description>Microsoft's .NET initiative is explored in
      detail in this deep programmer's reference.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in
      detail, with attention to XML DOM interfaces, XSLT processing,
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in
      detail, with attention to XML DOM interfaces, XSLT processing,
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in
      detail, with attention to XML DOM interfaces, XSLT processing,
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in
      detail, with attention to XML DOM interfaces, XSLT processing,
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in
      detail, with attention to XML DOM interfaces, XSLT processing,
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in
      detail, with attention to XML DOM interfaces, XSLT processing,
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in
      detail, with attention to XML DOM interfaces, XSLT processing,
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
   <book id="bk111">
      <author>O'Brien, Tim</author>
      <title>MSXML3: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>36.95</price>
      <publish_date>2000-12-01</publish_date>
      <description>The Microsoft MSXML3 parser is covered in
      detail, with attention to XML DOM interfaces, XSLT processing,
      SAX and more.</description>
   </book>
   <book id="bk112">
      <author>Galos, Mike</author>
      <title>Visual Studio 7: A Comprehensive Guide</title>
      <genre>Computer</genre>
      <price>49.95</price>
      <publish_date>2001-04-16</publish_date>
      <description>Microsoft Visual Studio 7 is explored in depth,
      looking at how Visual Basic, Visual C++, C#, and ASP+ are
      integrated into a comprehensive development
      environment.</description>
   </book>
</catalog>`;

const xml3 = `<catalog>
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus justo orci, quis tristique dolor maximus sed. Aliquam pellentesque consequat mollis. Vestibulum suscipit erat ac libero aliquam porttitor. Nulla facilisi. Integer id lorem velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla id dapibus mi. Quisque non nulla justo.

Praesent tincidunt, nunc a ornare placerat, quam metus cursus enim, non interdum diam purus sed dui. Nulla ligula urna, elementum ut mauris et, vulputate commodo magna. Aliquam mi dui, ornare a erat et, varius suscipit nisi. Donec lacinia imperdiet lorem, finibus viverra nulla tincidunt quis. Donec egestas pretium magna, id mollis velit blandit vel. Ut sagittis lorem vestibulum consectetur posuere. Vestibulum elit massa, mollis id felis et, sollicitudin laoreet nibh. Phasellus sapien libero, fringilla vitae ultrices eu, scelerisque in tortor. Etiam fermentum erat at arcu venenatis aliquam. Maecenas mollis eleifend metus, ut euismod erat dignissim nec. Cras sagittis nisi eu quam accumsan, a ultricies nunc luctus. Proin tortor nisi, tempor in ipsum a, convallis pharetra justo. Quisque sollicitudin sem vitae massa congue tristique. Aliquam in ligula non ante volutpat tristique. Vestibulum euismod placerat quam, ac fringilla sapien dignissim vel. Suspendisse sagittis imperdiet quam, id consequat dolor.

Integer ornare lorem sit amet lacus elementum pellentesque. Vestibulum varius finibus ultricies. Nulla vehicula lectus ac placerat rhoncus. Proin id tellus euismod, varius dui eget, ullamcorper leo. Suspendisse maximus sollicitudin urna, sit amet suscipit eros ultricies ut. Sed ornare cursus maximus. Aenean at blandit leo, a posuere enim. Aliquam congue massa in arcu malesuada, at interdum urna dictum. Aenean in tellus lacinia, tristique metus at, tincidunt tortor. Suspendisse pellentesque in enim ut facilisis. Cras et risus et massa elementum aliquam.

Nunc id justo a mi facilisis porttitor. Nullam vitae congue libero. Phasellus id tellus ut nulla scelerisque hendrerit. Fusce in pellentesque nunc. Quisque vulputate, ante id porta varius, dolor ex tempor justo, non mollis ante ligula sed est. Ut neque nunc, gravida a vulputate laoreet, commodo sed dolor. Donec viverra eleifend lobortis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nam sit amet sodales elit, vitae suscipit lectus. Pellentesque nec malesuada orci.

Integer tincidunt posuere velit. Nullam aliquam nulla sem, vel cursus magna accumsan at. Fusce scelerisque semper dictum. Donec viverra, massa quis luctus consequat, diam risus tempus ligula, eu fringilla leo ipsum sit amet odio. Vivamus malesuada tortor velit, ac vestibulum augue iaculis a. Integer interdum massa eget rutrum convallis. Integer ac bibendum nulla. Quisque vel lacinia purus, id eleifend magna. Morbi ex tortor, placerat eget augue eget, dignissim placerat mi. Praesent ac mattis mauris. Proin vel nunc viverra lorem tincidunt auctor. Morbi vitae mattis nisl. In pretium dapibus lectus, sit amet porta purus dictum eget. Pellentesque lobortis ante eu ornare porttitor. Nullam varius sagittis lorem, ut lacinia justo viverra quis. Fusce turpis metus, efficitur id eleifend ac, ullamcorper vitae diam.
</catalog>`;

const content = `Microsoft Visual Studio 7 is explored in depth,
looking at how Visual Basic, Visual C++, C#, and ASP+ are
integrated into a comprehensive development
environment.`;

const xml2 = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?my-instruction text="foo" type="foo"?>
<Element xmlns="foo" />`;

// const buf = Buffer.from(content);

// const lexer = new Lexer(content);

const domParser = new DOMParser();

// const p = new XMLParser('<e>\r\r\r\r\n</e>');
const p = new XMLParser(xml1);

// let token;

// function test(token: number) {
//   if (token === TokenCodes.WHITE_SPACE) return true;
//   if (token === TokenCodes.TAB) return true;
//   if (token === TokenCodes.CARRIAGE_RETURN) return true;
//   if (token === TokenCodes.NEWLINE) return true;

//   return false;
// }

const lexer = new Lexer('hoi');

const map = {
  a: 0x61
};

let char = 'b';

const s = performance.now();

// /[A-z]/.test('a');

// if (char === 'a') {
//   const b = map.a;
// } else char.charCodeAt(0);

// char.charCodeAt(0);

// const doc1 = p.parse();
// const doc2 = domParser.parseFromString('<e>\r\r\r\r\n</e>');
const doc2 = domParser.parseFromString(xml1);

const e = performance.now();

// const s1 = performance.now();

// const doc2 = domParser.parseFromString(xml2);

// const e1 = performance.now();

// test(0x0);

// console.log(result);

// console.log(JSON.stringify(document, null, 2))

// console.dir(doc1, { depth: 1 });

// console.dir(doc2, { depth: 1 });

console.log(e - s);

// console.log(doc1.documentElement);

// console.log(e1 - s1);

// generateCode();

let a = [];

a[2 ** 32 - 1] = 1;

a[-1] = 2;

console.log(a);
