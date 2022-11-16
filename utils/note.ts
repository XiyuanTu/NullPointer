import { FileOrFolder } from "../types/constants";

export const convertTreeViewData = (rawData: any[]): RenderTree => {
    const data: RenderTree = {
      id: "root",
      level: -1,
      name: "root",
      isNew: false,
      children: [],
    };
  
    const folders: RenderTree[] = [];
  
    const map = new Map<string, RenderTree[]>();
  
    rawData.map((obj) => {
      let newObj: RenderTree = {
        id: obj._id + "",
        level: 0,
        name: obj.name,
        isNew: false,
      };
  
      if (obj.type === FileOrFolder.Folder) {
        newObj.children = [];
      } else {
        newObj.public = obj.public;
        newObj.favorite = obj.favorite;
      }
  
      if (obj.belongTo) {
        if (map.has(obj.belongTo + "")) {
          map.get(obj.belongTo + "")!.push(newObj);
        } else {
          map.set(obj.belongTo + "", [newObj]);
        }
      } else {
        if (obj.type === FileOrFolder.Folder) {
          folders.push(newObj);
        }
        data.children!.push(newObj);
      }
    });
  
    const compareFn = (a: RenderTree, b: RenderTree) => {
      if ((a.children === undefined) === (b.children === undefined))
        return a.name > b.name ? 1 : -1;
  
      return a.children ? -1 : 1;
    };
  
    data.children!.sort(compareFn);
  
    const getChildren = (obj: RenderTree, level: number) => {
      obj.level = level;
  
      // if it's a file or if it's a folder but nothing in it
      if (!obj.children || !map.has(obj.id)) return;
  
      obj.children = map.get(obj.id);
      obj.children!.sort(compareFn);
  
      obj.children!.map((child) => getChildren(child, level + 1));
    };
  
    folders.map((folder) => getChildren(folder, 0));
   
    return data;
  };