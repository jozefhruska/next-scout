export type DirectoryTreeNode = {
  name: string;
  page: boolean;
  children: DirectoryTreeNode[];
};

export enum RouteFolderType {
  App,
  Pages,
}
