import { TreeNode, NodePosition } from '../types';

// 创建一个树节点
export function createTreeNode(val: number, id?: string): TreeNode {
  return {
    val,
    left: null,
    right: null,
    id: id || `node-${Math.random().toString(36).substring(2, 9)}`
  };
}

// 创建示例树1
export function createTree1(): TreeNode {
  const root = createTreeNode(1, 'tree1-1');
  root.left = createTreeNode(3, 'tree1-3');
  root.right = createTreeNode(2, 'tree1-2');
  root.left.left = createTreeNode(5, 'tree1-5');
  return root;
}

// 创建示例树2
export function createTree2(): TreeNode {
  const root = createTreeNode(2, 'tree2-2');
  root.left = createTreeNode(1, 'tree2-1');
  root.right = createTreeNode(3, 'tree2-3');
  root.left.right = createTreeNode(4, 'tree2-4');
  root.right.right = createTreeNode(7, 'tree2-7');
  return root;
}

// 计算树的高度
export function getTreeHeight(root: TreeNode | null): number {
  if (!root) return 0;
  return Math.max(getTreeHeight(root.left), getTreeHeight(root.right)) + 1;
}

// 计算节点在画布上的位置
export function calculateNodePositions(
  root: TreeNode | null, 
  baseX: number,
  baseY: number,
  horizontalSpacing: number,
  verticalSpacing: number
): Map<string, NodePosition> {
  const positions = new Map<string, NodePosition>();
  
  function traverse(node: TreeNode | null, x: number, y: number, level: number): void {
    if (!node) return;
    
    // 保存当前节点位置
    positions.set(node.id!, { x, y });
    
    // 递归计算左右子节点位置
    const nextLevel = level + 1;
    const offset = horizontalSpacing / Math.pow(2, nextLevel);
    
    if (node.left) {
      traverse(node.left, x - offset, y + verticalSpacing, nextLevel);
    }
    
    if (node.right) {
      traverse(node.right, x + offset, y + verticalSpacing, nextLevel);
    }
  }
  
  traverse(root, baseX, baseY, 0);
  return positions;
}

// 执行DFS（深度优先搜索）合并两棵树
export function mergeTrees(root1: TreeNode | null, root2: TreeNode | null): TreeNode | null {
  if (!root1) return root2;
  if (!root2) return root1;
  
  const merged = createTreeNode(root1.val + root2.val, `merged-${root1.id}-${root2.id}`);
  
  merged.left = mergeTrees(root1.left, root2.left);
  merged.right = mergeTrees(root1.right, root2.right);
  
  return merged;
} 