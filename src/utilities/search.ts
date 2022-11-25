import {
  RouteFolderType,
  RouteTreeNode,
  RouteTreeNodeType,
} from '../types';
import { isAuxiliaryNode, isPage } from './checks';
import { readdirSync } from 'node:fs';
import { parse, resolve } from 'node:path';
import {
  DEFAULT_APP_FOLDER_PATH,
  DEFAULT_PAGES_FOLDER_PATH,
  EXCLUDED_FILES,
  EXCLUDED_FOLDERS,
  INDEX_FILE_NAME_REGEX,
} from '../constants';
import { Dirent } from 'fs';
import chalk from 'chalk';

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
  let dirents: Dirent[] = [];

  try {
    dirents = readdirSync(path, {
      withFileTypes: true,
    });
  } catch (error) {
    console.log(
      chalk.bgGray.whiteBright(' INFO '),
      chalk.white('No routes found in'),
      chalk.bold(
        routeFolderType === RouteFolderType.App
          ? DEFAULT_APP_FOLDER_PATH
          : DEFAULT_PAGES_FOLDER_PATH
      ),
      chalk.white("(directory doesn't exist or is inaccessible).")
    );
  }

  const baseName = parse(path).name;

  // Check if the current folder is an auxiliary (helper)
  // Used to check for excluded files/folders (i.e. _document.*)
  const isAuxNode = isAuxiliaryNode(baseName);

  const children: RouteTreeNode[] = [];

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      if (isAuxNode && EXCLUDED_FOLDERS.includes(dirent.name)) {
        continue;
      }

      children.push(
        buildRouteTree(resolve(path, dirent.name), routeFolderType)
      );
    } else if (
      dirent.isFile() &&
      routeFolderType === RouteFolderType.Pages &&
      !INDEX_FILE_NAME_REGEX.test(dirent.name)
    ) {
      const fileBaseName = parse(resolve(path, dirent.name)).name;

      if (isAuxNode && EXCLUDED_FILES.includes(fileBaseName)) {
        continue;
      }

      children.push({
        name: fileBaseName,
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
