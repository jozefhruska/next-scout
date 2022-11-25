import type { Dirent } from 'fs';
import {
  INDEX_FILE_NAME_REGEX,
  PAGE_FILE_NAME_REGEX,
  ROOT_NODE_NAME,
} from '../constants';
import { RouteTreeNode, RouteTreeNodeType } from '../types';

export const isPage = (dirents: Dirent[]): boolean =>
  !!dirents.length &&
  dirents.some(
    (d) =>
      d.name.match(PAGE_FILE_NAME_REGEX) ||
      d.name.match(INDEX_FILE_NAME_REGEX)
  );

export const isRouteGroup = (node: RouteTreeNode): boolean =>
  node.type === RouteTreeNodeType.RouteGroup;

export const isDynamicRoute = (node: RouteTreeNode): boolean =>
  node.type === RouteTreeNodeType.Dynamic ||
  node.type === RouteTreeNodeType.DynamicCatchAll ||
  node.type === RouteTreeNodeType.DynamicCatchAllOptional;

export const isCatchAllRoute = (node: RouteTreeNode): boolean =>
  node.type === RouteTreeNodeType.DynamicCatchAll ||
  node.type === RouteTreeNodeType.DynamicCatchAllOptional;

export const isAuxiliaryNode = (nodeName: string): boolean =>
  [ROOT_NODE_NAME, 'app', 'pages'].includes(nodeName);
