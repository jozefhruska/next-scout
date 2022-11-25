import {
  RouteFolderType,
  RouteTreeNode,
  RouteTreeNodeType,
} from '../types';
import { isAuxiliaryNode, isPage } from './checks';
import { readdirSync } from 'node:fs';
import { parse, resolve } from 'node:path';
import { INDEX_FILE_NAME_REGEX } from '../constants';

/**
 * Determines the route tree node type from the node name.
 *
 * @param nodeName Route tree node name
 */
export const getRouteTreeNodeType = (
  nodeName: string
): RouteTreeNodeType => {
  if (nodeName.includes('[')) {
    if (nodeName.includes('...')) {
      if (nodeName.includes('[[')) {
        return RouteTreeNodeType.DynamicCatchAllOptional;
      } else {
        return RouteTreeNodeType.DynamicCatchAll;
      }
    } else {
      return RouteTreeNodeType.Dynamic;
    }
  }

  if (nodeName.includes('(') || isAuxiliaryNode(nodeName)) {
    return RouteTreeNodeType.RouteGroup;
  }

  return RouteTreeNodeType.Static;
};

export const buildRouteTree = (
  path: string,
  routeFolderType: RouteFolderType
): RouteTreeNode => {
  const dirents = readdirSync(path, {
    withFileTypes: true,
  });

  const baseName = parse(path).name;

  const children: RouteTreeNode[] = [];

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      children.push(
        buildRouteTree(resolve(path, dirent.name), routeFolderType)
      );
    } else if (
      dirent.isFile() &&
      routeFolderType === RouteFolderType.Pages &&
      !INDEX_FILE_NAME_REGEX.test(dirent.name)
    ) {
      children.push({
        name: parse(resolve(path, dirent.name)).name,
        type: getRouteTreeNodeType(dirent.name),
        page: true,
        children: [],
      });
    }
  }

  return {
    name: baseName,
    type: getRouteTreeNodeType(baseName),
    page: isPage(dirents),
    children,
  };
};
