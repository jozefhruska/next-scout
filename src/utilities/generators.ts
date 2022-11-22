import { DirectoryTreeNode } from '../types';
import {
  generateArguments,
  getIndent,
  getPagePath,
  sanitizeKeyName,
  transformKeyName,
  updateBase,
} from './transforms';
import { isAuxiliaryNode, isDynamicRoute, isRouteGroup } from './checks';

export const generateRouteBuilderType = (
  directoryTree: DirectoryTreeNode
): string => {
  let acc = '';

  acc += 'export type RouteBuilder = {\n';
  acc += generateRouteBuilderTypeBody(directoryTree);
  acc += '};\n';

  return acc;
};

const generateRouteBuilderTypeBody = (
  node: DirectoryTreeNode,
  args: string[] = [],
  depth = 1
): string => {
  let acc = '';

  const updatedArguments = [
    ...args,
    ...(isDynamicRoute(node.name) ? [sanitizeKeyName(node.name)] : []),
  ];

  // If the current directory is an auxiliary folder or a Route Group, skip it and continue with children instead
  if (isAuxiliaryNode(node.name) || isRouteGroup(node.name)) {
    if (node.page) {
      acc +=
        getIndent(depth) +
        `getPath: (${generateArguments(updatedArguments)}) => string;\n`;
    }

    acc += node.children.reduce(
      (p, c) => p + generateRouteBuilderTypeBody(c, args, depth),
      ''
    );
  } else {
    const indent = getIndent(depth);

    acc += indent + `${transformKeyName(node.name)}: {\n`;

    if (node.page) {
      acc +=
        getIndent(depth + 1) +
        `getPath: (${generateArguments(updatedArguments)}) => string;\n`;
    }

    if (node.children.length) {
      acc += node.children.reduce(
        (p, c) =>
          p + generateRouteBuilderTypeBody(c, updatedArguments, depth + 1),
        ''
      );
    }

    acc += indent + '},\n';
  }

  return acc;
};

export const generateRouteBuilder = (
  directoryTree: DirectoryTreeNode
): string => {
  let acc = '';

  acc += 'export const routeBuilder: RouteBuilder = {\n';
  acc += generateRouteBuilderBody(directoryTree);
  acc += '};\n';

  return acc;
};

const generateRouteBuilderBody = (
  node: DirectoryTreeNode,
  args: string[] = [],
  base = '/',
  depth = 1
): string => {
  let acc = '';

  const updatedArguments = [
    ...args,
    ...(isDynamicRoute(node.name) ? [sanitizeKeyName(node.name)] : []),
  ];

  // If the current directory is an auxiliary folder or a Route Group, skip it and continue with children instead
  if (isAuxiliaryNode(node.name) || isRouteGroup(node.name)) {
    if (node.page) {
      acc +=
        getIndent(depth) +
        `getPath: (${generateArguments(
          updatedArguments,
          false
        )}) => \`${base}\`,\n`;
    }

    acc += node.children.reduce(
      (p, c) => p + generateRouteBuilderBody(c, args, base, depth),
      ''
    );
  } else {
    const indent = getIndent(depth);

    acc += indent + `${transformKeyName(node.name)}: {\n`;

    if (node.page) {
      acc +=
        getIndent(depth + 1) +
        `getPath: (${generateArguments(
          updatedArguments,
          false
        )}) => \`${getPagePath(base, node)}\`,\n`;
    }

    if (node.children.length) {
      acc += node.children.reduce(
        (p, c) =>
          p +
          generateRouteBuilderBody(
            c,
            updatedArguments,
            updateBase(base, node),
            depth + 1
          ),
        ''
      );
    }

    acc += indent + '},\n';
  }

  return acc;
};
