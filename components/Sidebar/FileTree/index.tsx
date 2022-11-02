import { useState, useRef, useEffect } from "react";
import TreeView from "@mui/lab/TreeView";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";
import StyledTreeItem from "./StyledTreeItem"; 
import { useAppSelector, useAppDispatch } from "../../../state/hooks";
import { setSelectedId } from "../../../state/slices/selectedIdSlice";

interface IProps {
  data: RenderTree;
  setData: React.Dispatch<React.SetStateAction<RenderTree>>;
  folderIds: string[];
  setFolderIds: React.Dispatch<React.SetStateAction<string[]>>;
  expanded: string[];
  setExpanded: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function FileTree({
  data,
  setData,
  folderIds,
  setFolderIds,
  expanded,
  setExpanded,
}: IProps) {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.selectedId.value);

  // Have to turn on multiSelect so that we can unselect elements, but we don't actually want multiSelect, so we only take the first one (nodeIds[0])
  const handleSelect = (e: React.SyntheticEvent, nodeIds: Array<string>) => {
    if (nodeIds.includes(selectedId)) {
      // make sure when a folder is expanded, it needs to be selected
      if (!folderIds.includes(nodeIds[0]) || expanded.includes(nodeIds[0])) {
        dispatch(setSelectedId("root"));
      }
    } else {
      dispatch(setSelectedId(nodeIds[0]));
    }
  };

  const handleToggle = (e: React.SyntheticEvent, nodeIds: Array<string>) => {
    setExpanded(nodeIds);
  };

  return (
    <TreeView
      aria-label="file tree view"
      defaultCollapseIcon={<ArrowDropDownIcon />}
      defaultExpandIcon={<ArrowRightIcon />}
      defaultEndIcon={<div style={{ width: 24 }} />}
      sx={{
        flex: 1,
        overflowY: "auto",
        overflowX: "hidden",
        '&::-webkit-scrollbar': {
          width: 8,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'transparent',
          borderRadius: 5,
          // outline: '1px solid slategrey',
          '&:hover': {
            backgroundColor: '#F8F8FF',
          },
          '&:active': {
            backgroundColor: '#4682B4',
          }
        }
      }}
      multiSelect={true}
      selected={selectedId === "root" ? [] : [selectedId]}
      onNodeSelect={handleSelect}
      expanded={expanded}
      onNodeToggle={handleToggle}
      // onNodeFocus={(e: React.SyntheticEvent, nodeIds: Array<string> | string) =>
      //   console.log("focus: " + nodeIds)
      // }
    >
      {renderTree(data, data, data, setData, folderIds, setFolderIds)}
    </TreeView>
  );
}

const renderTree = (
  nodes: RenderTree, // The node that is going to be rendered
  parentNode: RenderTree,
  data: RenderTree, // It won't change, so that every node component can manipulate the whole data
  setData: React.Dispatch<React.SetStateAction<RenderTree>>,
  folderIds: string[],
  setFolderIds: React.Dispatch<React.SetStateAction<string[]>>
): any => {
  if (nodes.level === -1) {
    if (!nodes.children) {
      return;
    }
    return nodes.children.map((node: RenderTree) =>
      renderTree(node, nodes, data, setData, folderIds, setFolderIds)
    );
  }

  return Array.isArray(nodes.children) ? (
    <StyledTreeItem
      key={nodes.id}
      nodeId={nodes.id}
      labelText={nodes.name}
      labelIcon={FolderIcon}
      level={nodes.level}
      parentNode={parentNode}
      nodeObj={nodes}
      data={data}
      setData={setData}
      folderIds={folderIds}
      setFolderIds={setFolderIds}
      isNew={nodes.isNew}
    >
      {nodes.children.map((node: RenderTree) =>
        renderTree(node, nodes, data, setData, folderIds, setFolderIds)
      )}
    </StyledTreeItem>
  ) : (
    <StyledTreeItem
      key={nodes.id}
      nodeId={nodes.id}
      labelText={nodes.name}
      labelIcon={DescriptionIcon}
      level={nodes.level}
      parentNode={parentNode}
      nodeObj={nodes}
      data={data}
      setData={setData}
      folderIds={folderIds}
      setFolderIds={setFolderIds}
      isNew={nodes.isNew}
    />
  );
};

//   // Return an array that puts nodes of the same level in an array in order of the level
// const reconstructData = (data: RenderTree) => {
//   if (!Array.isArray(data.children)) return [[data]];

//   const result = [[data]];
//   let childrenArr = data.children;

//   while (childrenArr.length > 0) {
//     let newChildren: RenderTree[] = [];
//     let nextLayer: RenderTree[] = [];
//     result.push(nextLayer);

//     childrenArr.map((child) => {
//       nextLayer.push(child);
//       child.children && newChildren.push(...child.children);
//     });
//     childrenArr = newChildren;
//   }

//   return result;
// };

// const reconstructedData = reconstructData(rawData);
// console.log(reconstructedData)
