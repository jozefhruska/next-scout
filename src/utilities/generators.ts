import { ParamType, RouteTreeNode } from '../types';
import { getPagePath, getKeyName, updateBase } from './transforms';
import {
  isAuxiliaryNode,
  isCatchAllRoute,
  isDynamicRoute,
  isRouteGroup,
} from './checks';

/**
 * Utility function to generate indent (spaces).
 *
 * @param depth A number indicating the depth of the route tree
 */
export const getIndent = (depth: number) =>
  Array(depth * 2)
    .fill(' ')
    .join('');

/**
 * Updates the map of parameters used in the currently generated path.
 *
 * @param params The original (previous) params map
 * @param node Currently explored node
 */
export const updateParams = (
  params: Record<string, ParamType>,
  node: RouteTreeNode
): Record<string, ParamType> => {
  return isDynamicRoute(node)
    ? {
        ...params,
        [getKeyName(node.name)]: isCatchAllRoute(node)
          ? ParamType.Array
          : ParamType.String,
      }
    : params;
};

export const generateParams = (
  params: Record<string, ParamType>,
  withTypes = true
): string =>
  Object.entries(params).reduce(
    (acc, [paramKey, paramType], i, paramsArray) =>
      acc +
      paramKey +
      (withTypes
        ? `: ${paramType === ParamType.String ? 'string' : 'string[]'}`
        : '') +
      (i !== paramsArray.length - 1 ? ', ' : ''),
    ''
  );

export const generateRouteBuilderType = (
  directoryTree: RouteTreeNode
): string => {
  let acc = '';

  acc += 'export type RouteBuilder = {\n';
  acc += generateRouteBuilderTypeBody(directoryTree);
  acc += '};\n';

  return acc;
};

const generateRouteBuilderTypeBody = (
  node: RouteTreeNode,
  params: Record<string, ParamType> = {},
  depth = 1
): string => {
  let acc = '';

  const updatedParams = updateParams(params, node);

  // If the current directory is an auxiliary folder or a Route Group, skip it and continue with children instead
  if (isAuxiliaryNode(node.name) || isRouteGroup(node)) {
    if (node.page) {
      acc +=
        getIndent(depth) +
        `getPath: (${generateParams(updatedParams)}) => string;\n`;
    }

    acc += node.children.reduce(
      (p, c) => p + generateRouteBuilderTypeBody(c, params, depth),
      ''
    );
  } else {
    const indent = getIndent(depth);

    acc += indent + `${getKeyName(node.name)}: {\n`;

    if (node.page) {
      acc +=
        getIndent(depth + 1) +
        `getPath: (${generateParams(updatedParams)}) => string;\n`;
    }

    if (node.children.length) {
      acc += node.children.reduce(
        (p, c) =>
          p + generateRouteBuilderTypeBody(c, updatedParams, depth + 1),
        ''
      );
    }

    acc += indent + '},\n';
  }

  return acc;
};

export const generateRouteBuilder = (
  directoryTree: RouteTreeNode,
  trailingSlash: boolean
): string => {
  let acc = '';

  acc += 'export const routeBuilder: RouteBuilder = {\n';
  acc += generateRouteBuilderBody(directoryTree, trailingSlash);
  acc += '};\n';

  return acc;
};

const generateRouteBuilderBody = (
  node: RouteTreeNode,
  trailingSlash: boolean,
  params: Record<string, ParamType> = {},
  base = '/',
  depth = 1
): string => {
  let acc = '';

  const updatedParams = updateParams(params, node);

  // If the current directory is an auxiliary folder or a Route Group, skip it and continue with children instead
  if (isAuxiliaryNode(node.name) || isRouteGroup(node)) {
    if (node.page) {
      acc +=
        getIndent(depth) +
        `getPath: (${generateParams(
          updatedParams,
          false
        )}) => \`${base}\`,\n`;
    }

    acc += node.children.reduce(
      (p, c) =>
        p +
        generateRouteBuilderBody(c, trailingSlash, params, base, depth),
      ''
    );
  } else {
    const indent = getIndent(depth);

    acc += indent + `${getKeyName(node.name)}: {\n`;

    if (node.page) {
      acc +=
        getIndent(depth + 1) +
        `getPath: (${generateParams(
          updatedParams,
          false
        )}) => \`${getPagePath(base, node, trailingSlash)}\`,\n`;
    }

    if (node.children.length) {
      acc += node.children.reduce(
        (p, c) =>
          p +
          generateRouteBuilderBody(
            c,
            trailingSlash,
            updatedParams,
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
