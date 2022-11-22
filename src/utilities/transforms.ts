import { DIRECTORY_NAME_REGEX } from '../constants';
import { DirectoryTreeNode } from '../types';
import { isDynamicRoute, isRouteGroup } from './checks';

export const sanitizeKeyName = (keyName: string): string => {
  const [keyNameBase] = keyName.split('.');
  return keyNameBase.replace(DIRECTORY_NAME_REGEX, '');
};

export const transformKeyName = (keyName: string): string => {
  const sanitized = sanitizeKeyName(keyName);

  return sanitized.includes('-') ? `'${sanitized}'` : sanitized;
};

export const generateArguments = (
  args: string[],
  withTypes = true
): string =>
  args.reduce(
    (p, c, i) =>
      p +
      c +
      (withTypes ? ': string' : '') +
      (i !== args.length - 1 ? ', ' : ''),
    ''
  );

export const getPagePath = (
  base: string,
  node: DirectoryTreeNode
): string => {
  if (node.name === 'app') {
    return '/';
  }

  if (isDynamicRoute(node.name)) {
    return base + `/\${${sanitizeKeyName(node.name)}}`;
  }

  return (base === '/' ? '' : base) + `/${sanitizeKeyName(node.name)}`;
};

export const updateBase = (
  base: string,
  node: DirectoryTreeNode
): string => {
  if (node.name === 'app' || isRouteGroup(node.name)) {
    return base;
  }

  if (isDynamicRoute(node.name)) {
    return (
      (base === '/' ? '' : base) + `/\${${sanitizeKeyName(node.name)}}`
    );
  }

  return (base === '/' ? '' : base) + `/${sanitizeKeyName(node.name)}`;
};

export const getIndent = (depth: number) =>
  Array(depth * 2)
    .fill(' ')
    .join('');
