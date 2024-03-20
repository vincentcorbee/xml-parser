import {
  TagVistor,
  AttributeVistor,
  TextVistor,
  CommentVistor,
  Vistors,
  CDATAVistor
} from './types';

const tagVistor: TagVistor = {
  enter({ node, result, visitors, traverse }) {
    const { children, name, attrs } = node;

    const childElements: any[] = children.flatMap(
      (childNode) =>
        traverse({
          node: childNode,
          result,
          parent: node,
          visitors,
          traverse
        }) ?? []
    );

    let value: any;

    const hasAttributes = Object.keys(attrs).length > 0;

    const attributes = Object.values(attrs).map((attr) =>
      traverse({ node: attr, parent: node, visitors, traverse })
    );

    if (childElements.length === 0 && !hasAttributes) value = '';
    else if (childElements.length === 1 && !hasAttributes)
      value = childElements[0];
    else
      return {
        ...result,
        [name]: attributes.concat(childElements).reduce((acc, child) => {
          const entries = Object.entries(child);
          const [[key, val]] = entries;

          const current = acc[key as any];

          if (current !== undefined) {
            if (Array.isArray(current)) current.push(val);
            else acc[key as any] = [current, val];
          } else acc[key as any] = val;

          return acc;
        }, {} as any)
      };

    return { ...result, [name]: value['#text'] ?? value };
  }
};

const attributeVisitor: AttributeVistor = {
  enter({ node }) {
    return { [`@${node.name}`]: node.value };
  }
};

const textVistor: TextVistor = {
  enter({ node, result }) {
    const { name, value } = node;

    if (!/\S+/.test(value)) return null;

    return {
      ...result,
      [name]: value.trim()
    };
  }
};

const commentVisitor: CommentVistor = {
  enter({ node, result }) {
    const { name, value } = node;

    return {
      ...result,
      [name]: value.trim()
    };
  }
};

const cdataVistor: CDATAVistor = {
  enter({ node, result }) {
    const { name, value } = node;

    return {
      ...result,
      [name]: value.trim()
    };
  }
};

export const visitors: Vistors = {
  attribute: attributeVisitor,
  tag: tagVistor,
  emptyTag: tagVistor,
  text: textVistor,
  comment: commentVisitor,
  cdata: cdataVistor
};
