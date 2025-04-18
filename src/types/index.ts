// 树节点类型定义
export interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  id?: string; // 用于在UI中唯一标识节点
}

// 动画状态类型
export interface AnimationState {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  algorithm: 'DFS' | 'BFS';
}

// 树数据类型
export interface TreeData {
  root1: TreeNode | null;
  root2: TreeNode | null;
  mergedRoot: TreeNode | null;
  nodePositions: Map<string, {x: number, y: number}>;
}

// 节点位置类型
export interface NodePosition {
  x: number;
  y: number;
}

// 动画快照类型
export interface AnimationSnapshot {
  timestamp: number;
  nodesState: Map<string, { val: number, color: string, scale: number, opacity: number }>;
  edgesState: Map<string, { stroke: string, width: number, opacity: number }>;
  message: string;
}

// 动画步骤类型
export interface AnimationStep {
  snapshot: AnimationSnapshot;
  description: string;
} 