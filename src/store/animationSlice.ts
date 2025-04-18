import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AnimationStep, TreeData } from '../types';
import { createTree1, createTree2, calculateNodePositions, mergeTrees } from '../utils/treeUtils';
import { generateDFSAnimationSteps } from '../algorithms/dfsAlgorithm';
import { generateBFSAnimationSteps } from '../algorithms/bfsAlgorithm';

// 初始化树数据
const root1 = createTree1();
const root2 = createTree2();
const mergedRoot = mergeTrees(root1, root2);

// 计算节点位置
const tree1Positions = calculateNodePositions(root1, 200, 50, 160, 80);
const tree2Positions = calculateNodePositions(root2, 600, 50, 160, 80);
const mergedPositions = calculateNodePositions(mergedRoot, 400, 250, 160, 80);

// 合并所有位置
const nodePositions = new Map<string, {x: number, y: number}>();
tree1Positions.forEach((pos, id) => nodePositions.set(id, pos));
tree2Positions.forEach((pos, id) => nodePositions.set(id, pos));
mergedPositions.forEach((pos, id) => nodePositions.set(id, pos));

// 初始状态类型定义
interface AnimationSliceState {
  animation: {
    isPlaying: boolean;
    currentStep: number;
    totalSteps: number;
    speed: number;
    algorithm: 'DFS' | 'BFS';
  };
  treeData: TreeData;
  dfsSteps: AnimationStep[];
  bfsSteps: AnimationStep[];
  currentSnapshot: AnimationStep['snapshot'] | null;
}

// 初始状态
const initialState: AnimationSliceState = {
  animation: {
    isPlaying: false,
    currentStep: 0,
    totalSteps: 0,
    speed: 1,
    algorithm: 'DFS'
  },
  treeData: {
    root1,
    root2,
    mergedRoot,
    nodePositions
  },
  dfsSteps: generateDFSAnimationSteps(root1, root2),
  bfsSteps: generateBFSAnimationSteps(root1, root2),
  currentSnapshot: null
};

// 创建Redux切片
const animationSlice = createSlice({
  name: 'animation',
  initialState,
  reducers: {
    playAnimation: (state: AnimationSliceState) => {
      state.animation.isPlaying = true;
    },
    pauseAnimation: (state: AnimationSliceState) => {
      state.animation.isPlaying = false;
    },
    setSpeed: (state: AnimationSliceState, action: PayloadAction<number>) => {
      state.animation.speed = action.payload;
    },
    nextStep: (state: AnimationSliceState) => {
      const steps = state.animation.algorithm === 'DFS' ? state.dfsSteps : state.bfsSteps;
      if (state.animation.currentStep < steps.length - 1) {
        state.animation.currentStep += 1;
        state.currentSnapshot = steps[state.animation.currentStep].snapshot;
      }
    },
    prevStep: (state: AnimationSliceState) => {
      if (state.animation.currentStep > 0) {
        state.animation.currentStep -= 1;
        const steps = state.animation.algorithm === 'DFS' ? state.dfsSteps : state.bfsSteps;
        state.currentSnapshot = steps[state.animation.currentStep].snapshot;
      }
    },
    setCurrentStep: (state: AnimationSliceState, action: PayloadAction<number>) => {
      const steps = state.animation.algorithm === 'DFS' ? state.dfsSteps : state.bfsSteps;
      const step = Math.max(0, Math.min(action.payload, steps.length - 1));
      state.animation.currentStep = step;
      state.currentSnapshot = steps[step].snapshot;
    },
    setAlgorithm: (state: AnimationSliceState, action: PayloadAction<'DFS' | 'BFS'>) => {
      state.animation.algorithm = action.payload;
      state.animation.currentStep = 0;
      const steps = action.payload === 'DFS' ? state.dfsSteps : state.bfsSteps;
      state.animation.totalSteps = steps.length;
      state.currentSnapshot = steps[0].snapshot;
    },
    resetAnimation: (state: AnimationSliceState) => {
      state.animation.currentStep = 0;
      state.animation.isPlaying = false;
      const steps = state.animation.algorithm === 'DFS' ? state.dfsSteps : state.bfsSteps;
      state.currentSnapshot = steps[0].snapshot;
    }
  }
});

export const { 
  playAnimation,
  pauseAnimation,
  setSpeed,
  nextStep,
  prevStep,
  setCurrentStep,
  setAlgorithm,
  resetAnimation
} = animationSlice.actions;

export default animationSlice.reducer; 