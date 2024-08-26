import { XMLParser } from './xml-parser';

describe('XMLParser', () => {
  const parser = new XMLParser();

  describe('parse', () => {
    it('should throw an error when a root element is missing', () => {
      expect(() =>
        parser.parse(`<?xml version="1.0" encoding="UTF-8"?>`)
      ).toThrow();
    });

    it('should throw an error when the prologue is not the first element', () => {
      expect(() =>
        parser.parse(`
      <Element>
        Foo
      </Element>
      <?xml version="1.0" encoding="UTF-8"?>`)
      ).toThrow();
    });

    it('should throw an error when there is more then one root element', () => {
      expect(() =>
        parser.parse(`
      <Element>
        Foo
      </Element>
      <Element>
        Foo
      </Element>`)
      ).toThrow();
    });

    it('should throw an error when an element is invalid', () => {
      expect(() => parser.parse(`<Element><{}></Element>`)).toThrow();
    });

    it('should throw an error when closing tag is missing', () => {
      expect(() =>
        parser.parse(`<Element>
        <ChildElement>Foo</ChildElement>
        <AnotherChildElement>Foo
      </Element>`)
      ).toThrow();
    });

    it('should throw an error when attribute is invalid', () => {
      expect(() =>
        parser.parse(`<Element>
        <ChildElement name="value" age= >Foo</ChildElement>
      </Element>`)
      ).toThrow();
    });

    it('should parse an element', () => {
      const result = parser.parse(`<Element>foo</Element>`);

      expect(result).toEqual({
        type: 'document',
        name: '#document',
        docType: null,
        xmlDeclaration: null,
        root: {
          type: 'tag',
          name: 'Element',
          attrs: {},
          children: [
            {
              type: 'text',
              name: '#text',
              value: 'foo'
            }
          ]
        }
      });
    });

    it('should parse a self closing element', () => {
      const result = parser.parse(`<Element />`);

      expect(result).toEqual({
        type: 'document',
        name: '#document',
        docType: null,
        xmlDeclaration: null,
        root: {
          type: 'emptyTag',
          name: 'Element',
          attrs: {},
          children: [
            {
              type: 'text',
              name: '#text',
              value: ''
            }
          ]
        }
      });
    });

    it('should parse a comment', () => {
      const result = parser.parse(`<!-- Comment -->
      <Element/>`);

      expect(result).toEqual({
        type: 'document',
        name: '#document',
        docType: null,
        xmlDeclaration: null,
        root: {
          type: 'emptyTag',
          name: 'Element',
          attrs: {},
          children: [
            {
              type: 'text',
              name: '#text',
              value: ''
            }
          ]
        }
      });
    });

    it('should parse a multiline comment', () => {
      const result = parser.parse(`<!--
        This is a comment
        <Foo>
          Hello
        </Foo>
      -->
      <Element />`);

      expect(result).toEqual({
        type: 'document',
        name: '#document',
        docType: null,
        xmlDeclaration: null,
        root: {
          type: 'emptyTag',
          name: 'Element',
          attrs: {},
          children: [
            {
              type: 'text',
              name: '#text',
              value: ''
            }
          ]
        }
      });
    });

    it('should parse an xml document', () => {
      const result = parser.parse(`
      <Element>
        <ChildElement
          name="value"
          age="28"
        >Foo</ChildElement>
      </Element>`);

      expect(result).toEqual({
        type: 'document',
        name: '#document',
        docType: null,
        xmlDeclaration: null,
        root: {
          type: 'tag',
          name: 'Element',
          attrs: {},
          children: [
            { type: 'text', name: '#text', value: '\n        ' },
            {
              type: 'tag',
              name: 'ChildElement',
              attrs: {
                name: {
                  type: 'attribute',
                  raw: 'name="value"',
                  value: 'value',
                  name: 'name'
                },
                age: {
                  type: 'attribute',
                  raw: 'age="28"',
                  value: '28',
                  name: 'age'
                }
              },
              children: [{ type: 'text', name: '#text', value: 'Foo' }]
            },
            { type: 'text', name: '#text', value: '\n      ' }
          ]
        }
      });
    });
  });

  describe('toJSObject', () => {
    it('should convert document to Javascript object', () => {
      const result = parser.toJSObject(
        parser.parse(`<Element>
        <ChildElement name="value" age="28">Foo</ChildElement>
      </Element>`)
      );

      expect(result).toEqual({
        Element: {
          ChildElement: { '@name': 'value', '@age': '28', '#text': 'Foo' }
        }
      });
    });
  });
});
