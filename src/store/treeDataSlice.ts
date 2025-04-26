import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TreeNode } from '../types/TreeNode';

interface TreeDataState {
  leftTree: TreeNode | null;
  rightTree: TreeNode | null;
  mergedTree: TreeNode | null;
}

const initialState: TreeDataState = {
  leftTree: null,
  rightTree: null,
  mergedTree: null,
};

const treeDataSlice = createSlice({
  name: 'treeData',
  initialState,
  reducers: {
    setLeftTree: (state, action: PayloadAction<TreeNode | null>) => {
      state.leftTree = action.payload;
    },
    setRightTree: (state, action: PayloadAction<TreeNode | null>) => {
      state.rightTree = action.payload;
    },
    setMergedTree: (state, action: PayloadAction<TreeNode | null>) => {
      state.mergedTree = action.payload;
    },
    setTrees: (state, action: PayloadAction<{ leftTree: TreeNode | null; rightTree: TreeNode | null }>) => {
      state.leftTree = action.payload.leftTree;
      state.rightTree = action.payload.rightTree;
      state.mergedTree = null;
    },
  },
});

export const { setLeftTree, setRightTree, setMergedTree, setTrees } = treeDataSlice.actions;
export default treeDataSlice.reducer; 