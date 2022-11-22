import type { Dirent } from 'fs';
import {
  INDEX_FILE_NAME_REGEX,
  PAGE_FILE_NAME_REGEX,
  ROOT_NODE_NAME,
} from '../constants';

export const isPage = (dirents: Dirent[]): boolean =>
  !!dirents.length &&
  dirents.some(
    (d) =>
      d.name.match(PAGE_FILE_NAME_REGEX) ||
      d.name.match(INDEX_FILE_NAME_REGEX)
  );

export const isRouteGroup = (dirName: string): boolean =>
  dirName.includes('(');

export const isDynamicRoute = (dirName: string): boolean =>
  dirName.includes('[');

export const isAuxiliaryNode = (nodeName: string): boolean =>
  [ROOT_NODE_NAME, 'app', 'pages'].includes(nodeName);
