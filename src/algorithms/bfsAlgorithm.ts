import { TreeNode, AnimationStep } from '../types';
import { createTreeNode } from '../utils/treeUtils';

// 生成BFS算法的动画步骤
export function generateBFSAnimationSteps(
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
      message: "初始化：准备使用BFS（广度优先搜索）合并两棵树"
    },
    description: "我们将使用BFS（广度优先搜索）合并两棵树"
  });
  
  // 基本情况处理
  if (!root1) {
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: "第一棵树为空，直接返回第二棵树"
      },
      description: "当第一棵树为空时，直接返回第二棵树"
    });
    return steps;
  }
  
  if (!root2) {
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: "第二棵树为空，直接返回第一棵树"
      },
      description: "当第二棵树为空时，直接返回第一棵树"
    });
    return steps;
  }
  
  // 创建合并后的根节点
  const mergedRoot = createTreeNode(root1.val + root2.val, `merged-${root1.id}-${root2.id}`);
  
  // 高亮两个根节点
  if (root1?.id) {
    nodesState.set(root1.id, { 
      val: root1.val, 
      color: 'blue', 
      scale: 1.2,
      opacity: 1
    });
  }
  
  if (root2?.id) {
    nodesState.set(root2.id, { 
      val: root2.val, 
      color: 'orange', 
      scale: 1.2,
      opacity: 1
    });
  }
  
  // 添加合并根节点状态
  nodesState.set(mergedRoot.id!, { 
    val: mergedRoot.val, 
    color: 'green', 
    scale: 1.2,
    opacity: 0.7
  });
  
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: `合并根节点：${root1.val} + ${root2.val} = ${mergedRoot.val}`
    },
    description: `合并两棵树的根节点，得到 ${root1.val} + ${root2.val} = ${mergedRoot.val}`
  });
  
  // 恢复节点状态
  if (root1?.id) {
    nodesState.set(root1.id, { 
      val: root1.val, 
      color: 'blue', 
      scale: 1,
      opacity: 1
    });
  }
  
  if (root2?.id) {
    nodesState.set(root2.id, { 
      val: root2.val, 
      color: 'orange', 
      scale: 1,
      opacity: 1
    });
  }
  
  nodesState.set(mergedRoot.id!, { 
    val: mergedRoot.val, 
    color: 'green', 
    scale: 1,
    opacity: 1
  });
  
  // 初始化队列
  const queue1: (TreeNode | null)[] = [root1];
  const queue2: (TreeNode | null)[] = [root2];
  const mergedQueue: TreeNode[] = [mergedRoot];
  
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "初始化三个队列，分别存放两棵原树和合并树的节点"
    },
    description: "BFS需要使用队列来存储待处理的节点"
  });
  
  // BFS遍历并合并
  while (mergedQueue.length > 0) {
    const current = mergedQueue.shift()!;
    const node1 = queue1.shift();
    const node2 = queue2.shift();
    
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
    
    nodesState.set(current.id!, { 
      val: current.val, 
      color: 'green', 
      scale: 1.2,
      opacity: 1
    });
    
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: "从队列中取出一组节点进行处理"
      },
      description: "从三个队列的队首取出节点"
    });
    
    // 处理左子树
    if ((node1 && node1.left) || (node2 && node2.left)) {
      const leftVal1 = node1 && node1.left ? node1.left.val : 0;
      const leftVal2 = node2 && node2.left ? node2.left.val : 0;
      const mergedLeft = createTreeNode(
        leftVal1 + leftVal2,
        `merged-${node1?.left?.id || 'null'}-${node2?.left?.id || 'null'}`
      );
      
      current.left = mergedLeft;
      
      // 高亮左子节点
      if (node1?.left?.id) {
        nodesState.set(node1.left.id, { 
          val: node1.left.val, 
          color: 'blue', 
          scale: 1.2,
          opacity: 1
        });
      }
      
      if (node2?.left?.id) {
        nodesState.set(node2.left.id, { 
          val: node2.left.val, 
          color: 'orange', 
          scale: 1.2,
          opacity: 1
        });
      }
      
      nodesState.set(mergedLeft.id!, { 
        val: mergedLeft.val, 
        color: 'green', 
        scale: 1.2,
        opacity: 0.7
      });
      
      // 添加连接线
      if (current.id && mergedLeft.id) {
        edgesState.set(`${current.id}-${mergedLeft.id}`, {
          stroke: 'green',
          width: 2,
          opacity: 1
        });
      }
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: `合并左子节点：${leftVal1} + ${leftVal2} = ${mergedLeft.val}`
        },
        description: `合并左子节点，得到 ${leftVal1} + ${leftVal2} = ${mergedLeft.val}`
      });
      
      // 恢复节点状态
      if (node1?.left?.id) {
        nodesState.set(node1.left.id, { 
          val: node1.left.val, 
          color: 'blue', 
          scale: 1,
          opacity: 1
        });
      }
      
      if (node2?.left?.id) {
        nodesState.set(node2.left.id, { 
          val: node2.left.val, 
          color: 'orange', 
          scale: 1,
          opacity: 1
        });
      }
      
      nodesState.set(mergedLeft.id!, { 
        val: mergedLeft.val, 
        color: 'green', 
        scale: 1,
        opacity: 1
      });
      
      // 将子节点添加到队列中
      queue1.push(node1 ? node1.left : null);
      queue2.push(node2 ? node2.left : null);
      mergedQueue.push(mergedLeft);
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "将左子节点加入队列，以便后续处理"
        },
        description: "将左子节点添加到队列中，等待后续处理"
      });
    }
    
    // 处理右子树（逻辑与左子树类似）
    if ((node1 && node1.right) || (node2 && node2.right)) {
      const rightVal1 = node1 && node1.right ? node1.right.val : 0;
      const rightVal2 = node2 && node2.right ? node2.right.val : 0;
      const mergedRight = createTreeNode(
        rightVal1 + rightVal2,
        `merged-${node1?.right?.id || 'null'}-${node2?.right?.id || 'null'}`
      );
      
      current.right = mergedRight;
      
      // 高亮右子节点
      if (node1?.right?.id) {
        nodesState.set(node1.right.id, { 
          val: node1.right.val, 
          color: 'blue', 
          scale: 1.2,
          opacity: 1
        });
      }
      
      if (node2?.right?.id) {
        nodesState.set(node2.right.id, { 
          val: node2.right.val, 
          color: 'orange', 
          scale: 1.2,
          opacity: 1
        });
      }
      
      nodesState.set(mergedRight.id!, { 
        val: mergedRight.val, 
        color: 'green', 
        scale: 1.2,
        opacity: 0.7
      });
      
      // 添加连接线
      if (current.id && mergedRight.id) {
        edgesState.set(`${current.id}-${mergedRight.id}`, {
          stroke: 'green',
          width: 2,
          opacity: 1
        });
      }
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: `合并右子节点：${rightVal1} + ${rightVal2} = ${mergedRight.val}`
        },
        description: `合并右子节点，得到 ${rightVal1} + ${rightVal2} = ${mergedRight.val}`
      });
      
      // 恢复节点状态
      if (node1?.right?.id) {
        nodesState.set(node1.right.id, { 
          val: node1.right.val, 
          color: 'blue', 
          scale: 1,
          opacity: 1
        });
      }
      
      if (node2?.right?.id) {
        nodesState.set(node2.right.id, { 
          val: node2.right.val, 
          color: 'orange', 
          scale: 1,
          opacity: 1
        });
      }
      
      nodesState.set(mergedRight.id!, { 
        val: mergedRight.val, 
        color: 'green', 
        scale: 1,
        opacity: 1
      });
      
      // 将子节点添加到队列中
      queue1.push(node1 ? node1.right : null);
      queue2.push(node2 ? node2.right : null);
      mergedQueue.push(mergedRight);
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "将右子节点加入队列，以便后续处理"
        },
        description: "将右子节点添加到队列中，等待后续处理"
      });
    }
  }
  
  // 添加最终结果步骤
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "BFS合并完成！"
    },
    description: "使用BFS算法合并两棵二叉树完成"
  });
  
  return steps;
} 