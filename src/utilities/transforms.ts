import { RouteTreeNode } from '../types';
import {
  isAuxiliaryNode,
  isCatchAllRoute,
  isDynamicRoute,
  isRouteGroup,
} from './checks';

/**
 * Removes all "unnecessary" characters. For example, symbols Next.js uses to
 * differentiate between static/dynamic pages.
 *
 * @param nodeName Route tree node name (directory or file name)
 */
export const sanitizeNodeName = (nodeName: string): string => {
  return nodeName.replace(/[^\w\s-]/gi, '');
};

/**
 * Transforms a route tree node name to a camel-case, extension-less version.
 * Route tree names can be folder or file names. We have to transform these
 * names, so they can be used as object keys.
 *
 * @param nodeName Route tree node name (directory or file name)
 */
export const getKeyName = (nodeName: string): string => {
  const cleanName = sanitizeNodeName(nodeName);

  if (!/[-_]/g.test(nodeName)) {
    return cleanName;
  }

  // Convert to camelCase
  // Courtesy of Abbos (https://stackoverflow.com/a/61375162)
  return cleanName
    .toLowerCase()
    .replace(/([-_][a-z])/g, (group) =>
      group.toUpperCase().replace('-', '').replace('_', '')
    );
};

export const getPagePath = (base: string, node: RouteTreeNode): string => {
  if (node.name === 'app' || node.name === 'pages') {
    return '/';
  }

  if (isDynamicRoute(node)) {
    if (isCatchAllRoute(node)) {
      return base + `/\${${sanitizeNodeName(node.name)}.join('/')}`;
    } else {
      return base + `/\${${sanitizeNodeName(node.name)}}`;
    }
  }

  return (base === '/' ? '' : base) + `/${sanitizeNodeName(node.name)}`;
};

export const updateBase = (base: string, node: RouteTreeNode): string => {
  if (isAuxiliaryNode(node.name) || isRouteGroup(node)) {
    return base;
  }

  if (isDynamicRoute(node)) {
    return (
      (base === '/' ? '' : base) + `/\${${sanitizeNodeName(node.name)}}`
    );
  }

  return (base === '/' ? '' : base) + `/${sanitizeNodeName(node.name)}`;
};
