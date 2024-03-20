import { Vistors, XMLNode } from './types';

export const traverse = ({
  node,
  visitors,
  parent,
  result
}: {
  node: XMLNode;
  visitors: Vistors;
  result?: any;
  parent?: XMLNode;
}): any => {
  const actions = visitors[node.type];

  if (actions) {
    const { enter } = actions;

    if (enter) return enter({ node, parent, result, visitors, traverse });
  }

  return result;
};
