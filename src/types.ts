export enum RouteTreeNodeType {
  Static,
  Dynamic,
  DynamicCatchAll,
  DynamicCatchAllOptional,
  RouteGroup,
}

export type RouteTreeNode = {
  name: string;
  type: RouteTreeNodeType;
  page: boolean;
  children: RouteTreeNode[];
};

export enum RouteFolderType {
  App,
  Pages,
}

export enum ParamType {
  String,
  Array,
}
