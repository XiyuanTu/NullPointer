import { FileOrFolder } from "../types/constants";

export const isParentOrItself = (
  deletedNode: RenderTree,
  selectedNode: RenderTree
) => {
  if (selectedNode.id === deletedNode.id) return true;

  if (!deletedNode.children) return false;

  for (let child of deletedNode.children) {
    if (isParentOrItself(child, selectedNode)) {
      return true;
    }
  }
  return false;
};

export const getNodeById = (id: string, nodes: RenderTree) => {
  if (nodes.id === id) return nodes;

  if (!nodes.children) return undefined;

  for (let child of nodes.children) {
    const res = getNodeById(id, child) as RenderTree | undefined;
    if (res) {
      return res;
    }
  }
};

export const isNameTaken = (
  inputValue: string,
  nodeObj: RenderTree,
  parentNode: RenderTree
) => {
  const existed = parentNode.children!.find(
    (node) =>
      node.id !== nodeObj.id &&
      (nodeObj.children === undefined) === (node.children === undefined) &&
      node.name === inputValue
  );
  return existed ? true : false;
};

//If the return value is an array, then it contains the node and its parent. If not, then it is root node
export const getNodeAndParentById = (
  id: string,
  nodes: RenderTree
): RenderTree[] | RenderTree | undefined => {
  if (nodes.id === id) return nodes;

  if (!nodes.children) return undefined;

  for (let child of nodes.children) {
    const res = getNodeAndParentById(id, child) as RenderTree | undefined;
    if (res) {
      if (Array.isArray(res)) {
        return res;
      } else {
        return [res, nodes];
      }
    }
  }
};

export const findIndexOfFirstFile = (children: RenderTree[]) => {
  const index = children.findIndex((child) => !child.children);
  return index === -1 ? children.length : index;
};

export const getFolderIds = (data: RenderTree): string[] => {
  if (!data.children) return [];

  let res = data.level === -1 ? [] : [data.id];
  data.children.map((child) => {
    const ids = getFolderIds(child);
    res = [...res, ...ids];
  });

  return res;
};

export const nameGenerator = (type: FileOrFolder, parentNode: RenderTree) => {
  let suffix = 1;
  const prefix = "New " + type;
  let name = prefix;
  if (isNameUnique(type, name, parentNode)) {
    return name;
  } else {
    do {
      suffix++;
      name = prefix + " (" + suffix + ")";
    } while (!isNameUnique(type, name, parentNode));
    return name;
  }
};

const isNameUnique = (
  type: FileOrFolder,
  name: string,
  parentNode: RenderTree
) => {
  let isUnique;
  if (type === FileOrFolder.File) {
    isUnique = parentNode.children!.find(
      (node) => !node.children && node.name === name
    );
  } else {
    isUnique = parentNode.children!.find(
      (node) => node.children && node.name === name
    );
  }
  return isUnique ? false : true;
};
