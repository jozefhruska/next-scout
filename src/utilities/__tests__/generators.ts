import {
  generateParams,
  generateRouteBuilder,
  generateRouteBuilderType,
  getIndent,
  updateParams,
} from '../generators';
import { ParamType, RouteTreeNode, RouteTreeNodeType } from '../../types';
import { ROOT_NODE_NAME } from '../../constants';

describe('Utilities - Generators', () => {
  const routeTree: RouteTreeNode = {
    name: ROOT_NODE_NAME,
    type: RouteTreeNodeType.RouteGroup,
    page: false,
    children: [
      {
        name: 'app',
        type: RouteTreeNodeType.Static,
        page: true,
        children: [
          {
            name: '(marketing)',
            type: RouteTreeNodeType.RouteGroup,
            page: false,
            children: [
              {
                name: 'about-us',
                type: RouteTreeNodeType.Static,
                page: true,
                children: [],
              },
              {
                name: 'contact-us',
                type: RouteTreeNodeType.Static,
                page: true,
                children: [],
              },
            ],
          },
          {
            name: 'projects',
            type: RouteTreeNodeType.Static,
            page: false,
            children: [
              {
                name: '[slug]',
                type: RouteTreeNodeType.Dynamic,
                page: true,
                children: [],
              },
            ],
          },
          {
            name: 'forum',
            type: RouteTreeNodeType.Static,
            page: false,
            children: [
              {
                name: '[...rest]',
                type: RouteTreeNodeType.DynamicCatchAll,
                page: true,
                children: [],
              },
            ],
          },
        ],
      },
      {
        name: 'pages',
        type: RouteTreeNodeType.Static,
        page: false,
        children: [
          {
            name: 'gallery',
            type: RouteTreeNodeType.Static,
            page: true,
            children: [
              {
                name: '[[...rest]]',
                type: RouteTreeNodeType.DynamicCatchAllOptional,
                page: true,
                children: [],
              },
            ],
          },
        ],
      },
    ],
  };

  const routeBuilderType =
    'export type RouteBuilder = {\n' +
    '  getPath: () => string;\n' +
    '  aboutUs: {\n' +
    '    getPath: () => string;\n' +
    '  },\n' +
    '  contactUs: {\n' +
    '    getPath: () => string;\n' +
    '  },\n' +
    '  projects: {\n' +
    '    slug: {\n' +
    '      getPath: (slug: string) => string;\n' +
    '    },\n' +
    '  },\n' +
    '  forum: {\n' +
    '    rest: {\n' +
    '      getPath: (rest: string[]) => string;\n' +
    '    },\n' +
    '  },\n' +
    '  gallery: {\n' +
    '    getPath: () => string;\n' +
    '    rest: {\n' +
    '      getPath: (rest: string[]) => string;\n' +
    '    },\n' +
    '  },\n' +
    '};\n';

  const routeBuilder =
    'export const routeBuilder: RouteBuilder = {\n' +
    '  getPath: () => `/`,\n' +
    '  aboutUs: {\n' +
    '    getPath: () => `/about-us`,\n' +
    '  },\n' +
    '  contactUs: {\n' +
    '    getPath: () => `/contact-us`,\n' +
    '  },\n' +
    '  projects: {\n' +
    '    slug: {\n' +
    '      getPath: (slug) => `/projects/${slug}`,\n' +
    '    },\n' +
    '  },\n' +
    '  forum: {\n' +
    '    rest: {\n' +
    "      getPath: (rest) => `/forum/${rest.join('/')}`,\n" +
    '    },\n' +
    '  },\n' +
    '  gallery: {\n' +
    '    getPath: () => `/gallery`,\n' +
    '    rest: {\n' +
    "      getPath: (rest) => `/gallery/${rest.join('/')}`,\n" +
    '    },\n' +
    '  },\n' +
    '};\n';

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

  describe('generateRouteBuilderType', () => {
    it('Generates a valid route builder type', () => {
      expect(generateRouteBuilderType(routeTree)).toEqual(
        routeBuilderType
      );
    });
  });

  describe('generateRouteBuilder', () => {
    it('Generates a valid route builder object', () => {
      expect(generateRouteBuilder(routeTree)).toEqual(routeBuilder);
    });
  });
});
