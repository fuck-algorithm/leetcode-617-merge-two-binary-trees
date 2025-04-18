import { TreeNode, AnimationStep, AnimationSnapshot } from '../types';
import { createTreeNode } from '../utils/treeUtils';

// 生成DFS算法的动画步骤
export function generateDFSAnimationSteps(
  root1: TreeNode | null,
  root2: TreeNode | null
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const nodesState = new Map<string, { val: number, color: string, scale: number, opacity: number }>();
  const edgesState = new Map<string, { stroke: string, width: number, opacity: number }>();
  
  // 初始步骤
  steps.push({
    snapshot: {
      timestamp: 0,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "初始化：准备从两棵树的根节点开始合并"
    },
    description: "我们将从两棵树的根节点开始合并"
  });
  
  // 执行DFS并记录每一步
  function dfs(
    node1: TreeNode | null,
    node2: TreeNode | null,
    path: string[] = [],
    depth: number = 0
  ): TreeNode | null {
    // 基本情况处理
    if (!node1 && !node2) {
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "遇到两个空节点，返回null"
        },
        description: "当两个节点都为空时，直接返回null"
      });
      return null;
    }
    
    if (!node1) {
      // 高亮node2
      if (node2?.id) {
        nodesState.set(node2.id, { 
          val: node2.val, 
          color: 'orange', 
          scale: 1.2,
          opacity: 1
        });
      }
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: `第一棵树节点为空，返回第二棵树的节点 ${node2?.val}`
        },
        description: "当第一棵树节点为空时，返回第二棵树对应的节点"
      });
      
      // 恢复node2的状态
      if (node2?.id) {
        nodesState.set(node2.id, { 
          val: node2.val, 
          color: 'orange', 
          scale: 1,
          opacity: 1
        });
      }
      
      return node2;
    }
    
    if (!node2) {
      // 高亮node1
      if (node1?.id) {
        nodesState.set(node1.id, { 
          val: node1.val, 
          color: 'blue', 
          scale: 1.2,
          opacity: 1
        });
      }
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: `第二棵树节点为空，返回第一棵树的节点 ${node1?.val}`
        },
        description: "当第二棵树节点为空时，返回第一棵树对应的节点"
      });
      
      // 恢复node1的状态
      if (node1?.id) {
        nodesState.set(node1.id, { 
          val: node1.val, 
          color: 'blue', 
          scale: 1,
          opacity: 1
        });
      }
      
      return node1;
    }
    
    // 合并节点
    const mergedNode = createTreeNode(
      node1.val + node2.val,
      `merged-${node1.id}-${node2.id}`
    );
    
    // 高亮当前正在处理的节点
    if (node1?.id) {
      nodesState.set(node1.id, { 
        val: node1.val, 
        color: 'blue', 
        scale: 1.2,
        opacity: 1
      });
    }
    
    if (node2?.id) {
      nodesState.set(node2.id, { 
        val: node2.val, 
        color: 'orange', 
        scale: 1.2,
        opacity: 1
      });
    }
    
    // 添加合并节点状态
    nodesState.set(mergedNode.id!, { 
      val: mergedNode.val, 
      color: 'green', 
      scale: 1.2,
      opacity: 0.7 // 开始是半透明的
    });
    
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: `合并节点：${node1.val} + ${node2.val} = ${mergedNode.val}`
      },
      description: `将两个节点的值相加 ${node1.val} + ${node2.val} = ${mergedNode.val}`
    });
    
    // 恢复节点状态
    if (node1?.id) {
      nodesState.set(node1.id, { 
        val: node1.val, 
        color: 'blue', 
        scale: 1,
        opacity: 1
      });
    }
    
    if (node2?.id) {
      nodesState.set(node2.id, { 
        val: node2.val, 
        color: 'orange', 
        scale: 1,
        opacity: 1
      });
    }
    
    // 设置合并节点为完全不透明
    nodesState.set(mergedNode.id!, { 
      val: mergedNode.val, 
      color: 'green', 
      scale: 1,
      opacity: 1
    });
    
    // 递归处理左子树
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: "递归处理左子树"
      },
      description: "现在递归处理左子树"
    });
    
    mergedNode.left = dfs(node1.left, node2.left, [...path, 'left'], depth + 1);
    
    // 递归处理右子树
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: "递归处理右子树"
      },
      description: "现在递归处理右子树"
    });
    
    mergedNode.right = dfs(node1.right, node2.right, [...path, 'right'], depth + 1);
    
    return mergedNode;
  }
  
  // 执行DFS算法并生成步骤
  dfs(root1, root2);
  
  // 添加最终结果步骤
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "合并完成！"
    },
    description: "两棵二叉树合并完成"
  });
  
  return steps;
} 