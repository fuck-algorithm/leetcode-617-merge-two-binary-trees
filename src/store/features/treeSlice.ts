import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TreeNode } from '../../types/TreeNode';
import { arrayToTreeNode, parseTreeInput } from '../../utils/treeUtils';

interface TreeState {
  tree1: TreeNode | null;
  tree2: TreeNode | null;
  mergedTree: TreeNode | null;
  currentStep: number;
  totalSteps: number;
  steps: {
    description: string;
    mergedTree: TreeNode | null;
  }[];
}

// 初始树数据
const tree1Array = [1, 3, 2, 5];
const tree2Array = [2, 1, 3, null, 4, null, 7];

// 初始状态
const initialState: TreeState = {
  tree1: arrayToTreeNode(tree1Array),
  tree2: arrayToTreeNode(tree2Array),
  mergedTree: null,
  currentStep: 0,
  totalSteps: 0,
  steps: []
};

// 创建slice
const treeSlice = createSlice({
  name: 'tree',
  initialState,
  reducers: {
    setTreeData: (state, action: PayloadAction<{ tree1: (number | null)[], tree2: (number | null)[] }>) => {
      console.log('setTreeData调用:', action.payload);
      state.tree1 = arrayToTreeNode(action.payload.tree1);
      state.tree2 = arrayToTreeNode(action.payload.tree2);
      state.mergedTree = null;
      state.currentStep = 0;
      state.totalSteps = 0;
      state.steps = [];
      console.log('设置树数据完成:', { 
        tree1: state.tree1 ? '有效' : '空', 
        tree2: state.tree2 ? '有效' : '空' 
      });
    },
    setMergedTree: (state, action: PayloadAction<TreeNode | null>) => {
      console.log('setMergedTree调用:', action.payload ? '有效树' : '空树');
      state.mergedTree = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      console.log('setCurrentStep调用:', action.payload);
      state.currentStep = action.payload;
    },
    setSteps: (state, action: PayloadAction<{ 
      steps: { description: string, mergedTree: TreeNode | null }[],
      totalSteps: number
    }>) => {
      console.log('setSteps调用:', { 
        步骤数: action.payload.steps.length, 
        totalSteps: action.payload.totalSteps 
      });
      state.steps = action.payload.steps;
      state.totalSteps = action.payload.totalSteps;
      console.log('设置步骤后的state:', { 
        steps数量: state.steps.length, 
        totalSteps: state.totalSteps 
      });
    },
    nextStep: (state) => {
      console.log('nextStep调用 - 当前/总步骤:', state.currentStep, state.totalSteps);
      if (state.currentStep < state.totalSteps - 1) {
        state.currentStep += 1;
        console.log('执行下一步，新步骤索引:', state.currentStep);
      }
    },
    prevStep: (state) => {
      console.log('prevStep调用 - 当前/总步骤:', state.currentStep, state.totalSteps);
      if (state.currentStep > 0) {
        state.currentStep -= 1;
        console.log('执行上一步，新步骤索引:', state.currentStep);
      }
    },
    resetSteps: (state) => {
      console.log('resetSteps调用');
      state.currentStep = 0;
      state.totalSteps = 0;
      state.steps = [];
      state.mergedTree = null;
    }
  }
});

export const { 
  setTreeData, 
  setMergedTree, 
  setCurrentStep, 
  setSteps,
  nextStep,
  prevStep,
  resetSteps
} = treeSlice.actions;

export default treeSlice.reducer; 