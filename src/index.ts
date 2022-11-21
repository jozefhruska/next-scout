#!/usr/bin/env node

import { readdirSync, writeFile } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import parser from 'yargs-parser';
import { DirectoryTreeNode, RouteFolderType } from './types';
import {
  generateRouteBuilder,
  generateRouteBuilderType,
} from './utilities/generators';
import { isPage } from './utilities/checks';
import {
  DEFAULT_APP_FOLDER_PATH,
  DEFAULT_PAGES_FOLDER_PATH,
  ROOT_NODE_NAME,
} from './constants';

const buildDirectoryTree = (
  dirPath: string,
  routeFolderType: RouteFolderType
): DirectoryTreeNode => {
  const dirents = readdirSync(dirPath, {
    withFileTypes: true,
  });

  const dirName = dirPath.split('/').at(-1) || '';

  const children: DirectoryTreeNode[] = [];

  for (const dirent of dirents) {
    if (dirent.isDirectory()) {
      children.push(
        buildDirectoryTree(resolve(dirPath, dirent.name), routeFolderType)
      );
    } else if (
      dirent.isFile() &&
      routeFolderType === RouteFolderType.Pages
    ) {
      children.push({
        name: dirent.name,
        page: true,
        children: [],
      });
    }
  }

  return {
    name: dirName,
    page: isPage(dirents),
    children,
  };
};

// Parse command-line arguments
const argv = parser(process.argv.slice(2), {
  alias: {
    output: ['o'],
  },
  string: ['output'],
  default: {
    output: './routeBuilder.ts',
  },
});

try {
  const directoryTree: DirectoryTreeNode = {
    name: ROOT_NODE_NAME,
    page: false,
    children: [
      buildDirectoryTree(
        resolve(DEFAULT_APP_FOLDER_PATH),
        RouteFolderType.App
      ),
      buildDirectoryTree(
        resolve(DEFAULT_PAGES_FOLDER_PATH),
        RouteFolderType.Pages
      ),
    ],
  };

  const routeBuilderType = generateRouteBuilderType(directoryTree);
  const routeBuilder = generateRouteBuilder(directoryTree);

  writeFile(
    argv.output,
    routeBuilderType + '\n' + routeBuilder,
    'utf8',
    (error) => {
      if (error) {
        console.error(
          chalk.redBright(
            chalk.bgRedBright(chalk.whiteBright(' ERROR ')),
            'Unable to write the output file',
            chalk.bold(argv.output) + '.'
          )
        );
        console.error(error);
      } else {
        console.log(
          chalk.bgGray(chalk.whiteBright(' INFO ')),
          chalk.white(
            'The route builder has been successfully exported to'
          ),
          chalk.bold(argv.output) + chalk.white('.')
        );
      }
    }
  );
} catch (error) {
  console.error(
    chalk.redBright(
      chalk.bgRedBright(chalk.whiteBright(' ERROR ')),
      'Unable to build the route builder.'
    )
  );
  console.error(error);
}
