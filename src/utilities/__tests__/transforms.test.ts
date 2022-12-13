import { getPagePath } from '../transforms';
import { RouteTreeNode, RouteTreeNodeType } from '../../types';

describe('Utilities - Transforms', () => {
  describe('getPagePath', () => {
    it('Returns the root path ("/") if the node is an auxiliary node', () => {
      expect(
        getPagePath('/', { name: 'app' } as RouteTreeNode, false)
      ).toEqual('/');
      expect(
        getPagePath('/', { name: 'pages' } as RouteTreeNode, false)
      ).toEqual('/');
    });

    const testCases = [
      [
        '/',
        { type: RouteTreeNodeType.Static, name: 'blog' } as RouteTreeNode,
        '/blog',
      ],
      [
        '/blog',
        {
          type: RouteTreeNodeType.Dynamic,
          name: '[pid]',
        } as RouteTreeNode,
        '/blog/${pid}',
      ],
      [
        '/blog',
        {
          type: RouteTreeNodeType.DynamicCatchAll,
          name: '[...rest]',
        } as RouteTreeNode,
        "/blog/${rest.join('/')}",
      ],
      [
        '/blog',
        {
          type: RouteTreeNodeType.DynamicCatchAllOptional,
          name: '[[...rest]]',
        } as RouteTreeNode,
        "/blog/${rest.join('/')}",
      ],
    ] as const;

    it.each(testCases)(
      'Returns correct paths without trailing slashes',
      (base, node, expected) => {
        expect(getPagePath(base, node, false)).toEqual(expected);
      }
    );

    it.each(testCases)(
      'Returns correct paths with trailing slashes',
      (base, node, expected) => {
        expect(getPagePath(base, node, true)).toEqual(expected + '/');
      }
    );
  });
});
