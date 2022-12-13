import { generateParams, getIndent, updateParams } from '../generators';
import { ParamType, RouteTreeNode, RouteTreeNodeType } from '../../types';

describe('Utilities - Generators', () => {
  describe('getIndent', () => {
    it.each([
      [0, ''],
      [1, '  '],
      [2, '    '],
    ])('Returns an indent of the correct size', (depth, expected) => {
      expect(getIndent(depth)).toEqual(expected);
    });
  });

  describe('updateParams', () => {
    const params: Record<string, ParamType> = {
      stringParam: ParamType.String,
    };

    it.each([
      [
        params,
        {
          name: '[pid]',
          type: RouteTreeNodeType.Dynamic,
        } as RouteTreeNode,
        {
          ...params,
          pid: ParamType.String,
        },
      ],
      [
        params,
        {
          name: '[...rest]',
          type: RouteTreeNodeType.DynamicCatchAll,
        } as RouteTreeNode,
        {
          ...params,
          rest: ParamType.Array,
        },
      ],
      [
        params,
        {
          name: '[[...rest]]',
          type: RouteTreeNodeType.DynamicCatchAll,
        } as RouteTreeNode,
        {
          ...params,
          rest: ParamType.Array,
        },
      ],
    ])(
      'Returns an updated params object if the current node is a dynamic route',
      (params, node, expected) => {
        expect(updateParams(params, node)).toEqual(expected);
      }
    );

    it.each([
      [
        params,
        {
          name: 'about-us',
          type: RouteTreeNodeType.Static,
        } as RouteTreeNode,
        params,
      ],
      [
        params,
        {
          name: '(marketing)',
          type: RouteTreeNodeType.RouteGroup,
        } as RouteTreeNode,
        params,
      ],
    ])(
      'Returns unchanged params object otherwise',
      (params, node, expected) => {
        expect(updateParams(params, node)).toEqual(expected);
      }
    );
  });

  describe('generateParams', () => {
    it.each([
      [{} as Record<string, ParamType>, ''],
      [
        {
          category: ParamType.String,
        } as Record<string, ParamType>,
        'category: string',
      ],
      [
        {
          category: ParamType.String,
          subCategory: ParamType.String,
          tags: ParamType.Array,
        } as Record<string, ParamType>,
        'category: string, subCategory: string, tags: string[]',
      ],
    ])(
      'Returns a sequence of function parameters with types',
      (params, expected) => {
        expect(generateParams(params)).toEqual(expected);
      }
    );

    it.each([
      [{} as Record<string, ParamType>, ''],
      [
        {
          category: ParamType.String,
        } as Record<string, ParamType>,
        'category',
      ],
      [
        {
          category: ParamType.String,
          subCategory: ParamType.String,
          tags: ParamType.Array,
        } as Record<string, ParamType>,
        'category, subCategory, tags',
      ],
    ])(
      'Returns a sequence of function parameters without types',
      (params, expected) => {
        expect(generateParams(params, false)).toEqual(expected);
      }
    );
  });
});
