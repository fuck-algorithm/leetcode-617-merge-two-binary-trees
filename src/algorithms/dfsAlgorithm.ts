import { TreeNode, AnimationStep } from '../types';
import { createTreeNode } from '../utils/treeUtils';

/**
 * 生成DFS算法的动画步骤
 * 完全按照动画分镜文档要求重新实现
 */
export function generateDFSAnimationSteps(
  root1: TreeNode | null,
  root2: TreeNode | null
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const nodesState = new Map<string, { val: number, color: string, scale: number, opacity: number }>();
  const edgesState = new Map<string, { stroke: string, width: number, opacity: number }>();
  
  // 阶段1：初始化
  // 步骤1.1：展示问题
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "初始化：准备从两棵树的根节点开始合并"
    },
    description: "我们将从两棵树的根节点开始合并。蓝色表示第一棵树，橙色表示第二棵树，绿色表示合并后的树。DFS会按照深度优先的顺序进行合并：先处理当前节点，然后处理左子树，最后处理右子树。"
  });
  
  // 步骤1.2：标记根节点
  if (root1?.id) {
    nodesState.set(root1.id, { 
      val: root1.val, 
      color: '#4285F4', // 蓝色
      scale: 1.2,
      opacity: 1
    });
  }
  
  if (root2?.id) {
    nodesState.set(root2.id, { 
      val: root2.val, 
      color: '#F4B400', // 橙色
      scale: 1.2,
      opacity: 1
    });
  }
  
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "标记根节点"
    },
    description: "我们将从根节点开始进行DFS合并，首先关注两棵树的根节点，以它们为起点开始递归过程。"
  });
  
  // 深度优先搜索合并函数
  function dfs(
    node1: TreeNode | null,
    node2: TreeNode | null,
    parentMergedId: string | null = null,
    isLeft: boolean = false,
    depth: number = 0
  ): TreeNode | null {
    // 如果两个节点都不存在
    if (!node1 && !node2) {
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "遇到两个空节点，返回null"
        },
        description: "当左右两边都没有节点时，表示这个位置没有节点，无需合并，直接返回空。这是合并规则的第三条：如果两个节点都不存在，结果为空。"
      });
      return null;
    }
    
    // 如果只有一个节点存在（第一棵树节点存在）
    if (node1 && !node2) {
      // 高亮node1
      if (node1.id) {
        nodesState.set(node1.id, { 
          val: node1.val, 
          color: '#4285F4', // 蓝色
          scale: 1.2,
          opacity: 1
        });
      }
      
      // 创建合并结果节点（直接使用node1的值）
      const mergedNode = createTreeNode(node1.val, `merged-${node1.id}-null`);
      
      // 添加合并节点到状态
      nodesState.set(mergedNode.id!, { 
        val: mergedNode.val, 
        color: '#0F9D58', // 绿色
        scale: 1.2,
        opacity: 0.7
      });
      
      // 如果有父节点，添加边
      if (parentMergedId) {
        const edgeId = `${parentMergedId}-${mergedNode.id}`;
        edgesState.set(edgeId, {
          stroke: '#0F9D58',
          width: 1.5,
          opacity: 0.7
        });
      }
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: `第二棵树节点为空，直接使用第一棵树的节点 ${node1.val}`
        },
        description: "当一棵树的节点为空而另一棵不为空时，我们直接使用非空的节点。这种情况下，不需要值相加，直接复用已有节点。"
      });
      
      // 恢复node1的状态
      if (node1.id) {
        nodesState.set(node1.id, { 
          val: node1.val, 
          color: '#4285F4',
          scale: 1,
          opacity: 1
        });
      }
      
      // 设置合并节点为完全不透明
      nodesState.set(mergedNode.id!, { 
        val: mergedNode.val, 
        color: '#0F9D58',
        scale: 1,
        opacity: 1
      });
      
      // 递归处理左子树和右子树
      if (node1.left) {
        mergedNode.left = dfs(node1.left, null, mergedNode.id, true, depth + 1);
      }
      
      if (node1.right) {
        mergedNode.right = dfs(node1.right, null, mergedNode.id, false, depth + 1);
      }
      
      return mergedNode;
    }
    
    // 如果只有一个节点存在（第二棵树节点存在）
    if (!node1 && node2) {
      // 高亮node2
      if (node2.id) {
        nodesState.set(node2.id, { 
          val: node2.val, 
          color: '#F4B400', // 橙色
          scale: 1.2,
          opacity: 1
        });
      }
      
      // 创建合并结果节点（直接使用node2的值）
      const mergedNode = createTreeNode(node2.val, `merged-null-${node2.id}`);
      
      // 添加合并节点到状态
      nodesState.set(mergedNode.id!, { 
        val: mergedNode.val, 
        color: '#0F9D58', // 绿色
        scale: 1.2,
        opacity: 0.7
      });
      
      // 如果有父节点，添加边
      if (parentMergedId) {
        const edgeId = `${parentMergedId}-${mergedNode.id}`;
        edgesState.set(edgeId, {
          stroke: '#0F9D58',
          width: 1.5,
          opacity: 0.7
        });
      }
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: `第一棵树节点为空，直接使用第二棵树的节点 ${node2.val}`
        },
        description: "当一棵树的节点为空而另一棵不为空时，我们直接使用非空的节点。这种情况下，不需要值相加，直接复用已有节点。"
      });
      
      // 恢复node2的状态
      if (node2.id) {
        nodesState.set(node2.id, { 
          val: node2.val, 
          color: '#F4B400',
          scale: 1,
          opacity: 1
        });
      }
      
      // 设置合并节点为完全不透明
      nodesState.set(mergedNode.id!, { 
        val: mergedNode.val, 
        color: '#0F9D58',
        scale: 1,
        opacity: 1
      });
      
      // 递归处理左子树和右子树
      if (node2.left) {
        mergedNode.left = dfs(null, node2.left, mergedNode.id, true, depth + 1);
      }
      
      if (node2.right) {
        mergedNode.right = dfs(null, node2.right, mergedNode.id, false, depth + 1);
      }
      
      return mergedNode;
    }
    
    // 阶段2：深度优先遍历与合并
    // 两个节点都存在时
    
    // 步骤2.1：合并当前节点
    // 高亮当前正在处理的节点
    if (node1?.id) {
      nodesState.set(node1.id, { 
        val: node1.val, 
        color: '#4285F4', // 蓝色
        scale: 1.2,
        opacity: 1
      });
    }
    
    if (node2?.id) {
      nodesState.set(node2.id, { 
        val: node2.val, 
        color: '#F4B400', // 橙色
        scale: 1.2,
        opacity: 1
      });
    }
    
    // 合并节点值
    const mergedNode = createTreeNode(
      node1!.val + node2!.val,
      `merged-${node1!.id}-${node2!.id}`
    );
    
    // 添加合并节点到状态
    nodesState.set(mergedNode.id!, { 
      val: mergedNode.val, 
      color: '#0F9D58', // 绿色
      scale: 1.2,
      opacity: 0.7
    });
    
    // 如果有父节点，添加边
    if (parentMergedId) {
      const edgeId = `${parentMergedId}-${mergedNode.id}`;
      edgesState.set(edgeId, {
        stroke: '#0F9D58',
        width: 1.5,
        opacity: 0.7
      });
    }
    
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: `合并节点：${node1!.val} + ${node2!.val} = ${mergedNode.val}`
      },
      description: `我们将两棵树相同位置的节点值相加：${node1!.val} + ${node2!.val} = ${mergedNode.val}。这是合并二叉树算法的核心步骤，两个对应位置的节点值相加形成新节点。`
    });
    
    // 恢复节点状态
    if (node1?.id) {
      nodesState.set(node1.id, { 
        val: node1.val, 
        color: '#4285F4',
        scale: 1,
        opacity: 1
      });
    }
    
    if (node2?.id) {
      nodesState.set(node2.id, { 
        val: node2.val, 
        color: '#F4B400',
        scale: 1,
        opacity: 1
      });
    }
    
    // 设置合并节点为完全不透明
    nodesState.set(mergedNode.id!, { 
      val: mergedNode.val, 
      color: '#0F9D58',
      scale: 1,
      opacity: 1
    });
    
    // 步骤2.2：准备处理左子树
    // 高亮左子树方向
    if (node1?.left?.id || node2?.left?.id) {
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "递归处理左子树"
        },
        description: "现在我们向左移动，用相同的方法处理左子树。深度优先搜索(DFS)会先一直往左走到底，然后再回溯处理右边。"
      });
      
      // 高亮左子节点（如果存在）
      if (node1?.left?.id) {
        nodesState.set(node1.left.id, { 
          val: node1.left.val, 
          color: '#4285F4',
          scale: 1.2,
          opacity: 0.7
        });
      }
      
      if (node2?.left?.id) {
        nodesState.set(node2.left.id, { 
          val: node2.left.val, 
          color: '#F4B400',
          scale: 1.2,
          opacity: 0.7
        });
      }
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "准备合并左子节点"
        },
        description: "我们准备合并两棵树的左子节点，继续采用深度优先的合并策略。"
      });
      
      // 恢复左子节点状态
      if (node1?.left?.id) {
        nodesState.set(node1.left.id, { 
          val: node1.left.val, 
          color: '#4285F4',
          scale: 1,
          opacity: 1
        });
      }
      
      if (node2?.left?.id) {
        nodesState.set(node2.left.id, { 
          val: node2.left.val, 
          color: '#F4B400',
          scale: 1,
          opacity: 1
        });
      }
    }
    
    // 步骤2.3-2.4：递归合并左子节点
    mergedNode.left = dfs(node1!.left, node2!.left, mergedNode.id, true, depth + 1);
    
    // 步骤2.5：左子树处理完毕，回溯
    if (node1?.left || node2?.left) {
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "左子树处理完毕，回溯到上一层"
        },
        description: "我们已经处理完左子树的所有节点(或遇到了空节点)，现在回溯到上一层，准备处理右子树。这是DFS算法的典型特征——深度遍历完成后回溯。"
      });
    }
    
    // 步骤2.6：递归处理右子树
    if (node1?.right?.id || node2?.right?.id) {
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "递归处理右子树"
        },
        description: "左子树处理完毕，现在处理右子树。对于每个节点，我们都会先合并当前节点，然后先处理左子树，再处理右子树。"
      });
      
      // 高亮右子节点（如果存在）
      if (node1?.right?.id) {
        nodesState.set(node1.right.id, { 
          val: node1.right.val, 
          color: '#4285F4',
          scale: 1.2,
          opacity: 0.7
        });
      }
      
      if (node2?.right?.id) {
        nodesState.set(node2.right.id, { 
          val: node2.right.val, 
          color: '#F4B400',
          scale: 1.2,
          opacity: 0.7
        });
      }
      
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "准备合并右子节点"
        },
        description: "我们准备合并两棵树的右子节点，继续采用深度优先的合并策略。"
      });
      
      // 恢复右子节点状态
      if (node1?.right?.id) {
        nodesState.set(node1.right.id, { 
          val: node1.right.val, 
          color: '#4285F4',
          scale: 1,
          opacity: 1
        });
      }
      
      if (node2?.right?.id) {
        nodesState.set(node2.right.id, { 
          val: node2.right.val, 
          color: '#F4B400',
          scale: 1,
          opacity: 1
        });
      }
    }
    
    // 步骤2.7-2.10：递归合并右子节点
    mergedNode.right = dfs(node1!.right, node2!.right, mergedNode.id, false, depth + 1);
    
    // 如果不是根节点，显示处理完成的回溯消息
    if (depth > 0) {
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: `节点(值为${mergedNode.val})的子树处理完毕，回溯`
        },
        description: "我们已经完成了当前节点的所有子树处理，递归返回上一层。DFS算法通过这种深度优先和回溯的方式逐步构建最终的合并结果。"
      });
    }
    
    return mergedNode;
  }
  
  // 执行DFS算法并生成步骤
  const mergedRoot = dfs(root1, root2);
  
  // 阶段5：完成合并
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "合并完成！"
    },
    description: "两棵二叉树合并完成！我们已经遍历了两棵树的所有节点，并按照规则将它们合并成了一棵新的二叉树。回顾一下合并规则：1) 如果两个节点都存在，值相加；2) 如果只有一个节点存在，直接使用该节点；3) 如果两个节点都不存在，结果为空。"
  });
  
  return steps;
} 