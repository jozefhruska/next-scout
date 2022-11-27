import type { Dirent } from 'fs';
import {
  isAuxiliaryNode,
  isCatchAllRoute,
  isDynamicRoute,
  isPage,
  isRouteGroup,
} from '../checks';
import { RouteTreeNode, RouteTreeNodeType } from '../../types';
import { ROOT_NODE_NAME } from '../../constants';

describe('Utilities - Checks', () => {
  describe('isPage', () => {
    it('Returns "false" if dirents array is empty', () => {
      expect(isPage([])).toEqual(false);
    });

    it.each([
      [[{ name: 'page.js' }, { name: 'hello.js' }] as Dirent[], true],
      [[{ name: 'page.jsx' }, { name: 'hello.js' }] as Dirent[], true],
      [[{ name: 'page.tsx' }, { name: 'hello.js' }] as Dirent[], true],
      [[{ name: 'page.mdx' }, { name: 'hello.js' }] as Dirent[], true],
      [[{ name: 'hello.js' }] as Dirent[], false],
    ])(
      'Returns "true" if at least one dirent is a page file',
      (dirents, expected) => {
        expect(isPage(dirents)).toEqual(expected);
      }
    );

    it.each([
      [[{ name: 'index.js' }, { name: 'hello.js' }] as Dirent[], true],
      [[{ name: 'index.jsx' }, { name: 'hello.js' }] as Dirent[], true],
      [[{ name: 'index.tsx' }, { name: 'hello.js' }] as Dirent[], true],
      [[{ name: 'index.mdx' }, { name: 'hello.js' }] as Dirent[], true],
      [[{ name: 'hello.js' }] as Dirent[], false],
    ])(
      'Returns "true" if at least one dirent is an index file',
      (dirents, expected) => {
        expect(isPage(dirents)).toEqual(expected);
      }
    );
  });

  describe('isRouteGroup', () => {
    it.each([
      [{ type: RouteTreeNodeType.RouteGroup } as RouteTreeNode, true],
      [{ type: RouteTreeNodeType.Static } as RouteTreeNode, false],
      [{ type: RouteTreeNodeType.Dynamic } as RouteTreeNode, false],
      [
        { type: RouteTreeNodeType.DynamicCatchAll } as RouteTreeNode,
        false,
      ],
      [
        {
          type: RouteTreeNodeType.DynamicCatchAllOptional,
        } as RouteTreeNode,
        false,
      ],
      [{} as RouteTreeNode, false],
    ])(
      'Returns "true" only if the node is a route group',
      (node, expected) => {
        expect(isRouteGroup(node)).toEqual(expected);
      }
    );
  });

  describe('isDynamicRoute', () => {
    it.each([
      [{ type: RouteTreeNodeType.Dynamic } as RouteTreeNode, true],
      [{ type: RouteTreeNodeType.DynamicCatchAll } as RouteTreeNode, true],
      [
        {
          type: RouteTreeNodeType.DynamicCatchAllOptional,
        } as RouteTreeNode,
        true,
      ],
      [{ type: RouteTreeNodeType.Static } as RouteTreeNode, false],
      [{ type: RouteTreeNodeType.RouteGroup } as RouteTreeNode, false],
      [{} as RouteTreeNode, false],
    ])(
      'Returns "true" only if the node is a dynamic route',
      (node, expected) => {
        expect(isDynamicRoute(node)).toEqual(expected);
      }
    );
  });

  describe('isCatchAllRoute', () => {
    it.each([
      [{ type: RouteTreeNodeType.DynamicCatchAll } as RouteTreeNode, true],
      [
        {
          type: RouteTreeNodeType.DynamicCatchAllOptional,
        } as RouteTreeNode,
        true,
      ],
      [{ type: RouteTreeNodeType.Static } as RouteTreeNode, false],
      [{ type: RouteTreeNodeType.Dynamic } as RouteTreeNode, false],
      [{ type: RouteTreeNodeType.RouteGroup } as RouteTreeNode, false],
      [{} as RouteTreeNode, false],
    ])(
      'Returns "true" only if the node is a catch-all route',
      (node, expected) => {
        expect(isCatchAllRoute(node)).toEqual(expected);
      }
    );
  });

  describe('isAuxiliaryNode', () => {
    it.each([
      [ROOT_NODE_NAME, true],
      ['app', true],
      ['pages', true],
      ['hello', false],
    ])(
      'Returns "true" only if the node is an auxiliary node',
      (node, expected) => {
        expect(isAuxiliaryNode(node)).toEqual(expected);
      }
    );
  });
});
