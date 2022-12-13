#!/usr/bin/env node

import { writeFile } from 'node:fs';
import { resolve } from 'node:path';
import chalk from 'chalk';
import parser from 'yargs-parser';
import {
  RouteFolderType,
  RouteTreeNode,
  RouteTreeNodeType,
} from './types';
import {
  generateRouteBuilder,
  generateRouteBuilderType,
} from './utilities/generators';
import {
  DEFAULT_APP_FOLDER_PATH,
  DEFAULT_PAGES_FOLDER_PATH,
  ROOT_NODE_NAME,
} from './constants';
import { buildRouteTree } from './utilities/search';

// Parse command-line arguments
const argv = parser(process.argv.slice(2), {
  alias: {
    output: ['o'],
    'trailing-slash': ['t'],
  },
  string: ['output'],
  boolean: ['trailing-slash'],
  default: {
    output: './routeBuilder.ts',
    'trailing-slash': false,
  },
});

try {
  const routeTree: RouteTreeNode = {
    name: ROOT_NODE_NAME,
    type: RouteTreeNodeType.RouteGroup,
    page: false,
    children: [
      buildRouteTree(
        resolve(DEFAULT_APP_FOLDER_PATH),
        RouteFolderType.App
      ),
      buildRouteTree(
        resolve(DEFAULT_PAGES_FOLDER_PATH),
        RouteFolderType.Pages
      ),
    ],
  };

  const routeBuilderType = generateRouteBuilderType(routeTree);
  const routeBuilder = generateRouteBuilder(routeTree, argv.trailingSlash);

  writeFile(
    argv.output,
    routeBuilderType + '\n' + routeBuilder,
    'utf8',
    (error) => {
      if (error) {
        console.error(
          chalk.bgRedBright.whiteBright(' ERROR '),
          chalk.redBright(
            'Unable to write the output file',
            chalk.bold(argv.output) + '.'
          )
        );
        console.error(error);
        process.exit(2);
      } else {
        console.log(
          chalk.bgGreen.whiteBright(' SUCCESS '),
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
      chalk.bgRedBright.whiteBright(' ERROR '),
      'Unable to build the route builder.'
    )
  );
  console.error(error);
  process.exit(1);
}
