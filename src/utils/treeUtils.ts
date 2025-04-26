import { TreeNode } from '../types';

// 节点位置接口定义
interface NodePosition {
  x: number;
  y: number;
}

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

// 计算节点在画布上的位置 - 使用水平布局
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
    
    // 提取数字部分以正确计算位置，使用规范化的布局
    const idNum = node.id ? parseInt(node.id.split('-')[1]) : 0;
    
    // 基于节点ID的位置计算 - 使用水平布局
    const nodeX = idNum ? baseX + (idNum - 1) * 80 : x;
    const nodeY = baseY + level * verticalSpacing;
    
    // 保存当前节点位置
    positions.set(node.id!, { x: nodeX, y: nodeY });
    
    // 递归计算左右子节点位置
    if (node.left) {
      traverse(node.left, nodeX - horizontalSpacing, nodeY + verticalSpacing, level + 1);
    }
    
    if (node.right) {
      traverse(node.right, nodeX + horizontalSpacing, nodeY + verticalSpacing, level + 1);
    }
  }
  
  traverse(root, baseX, baseY, 0);
  return positions;
}

/**
 * 解析输入字符串为二叉树数组
 * 格式: [1,2,3,null,4]
 */
export const parseTreeInput = (input: string): (number | null)[] => {
  try {
    // 去除所有空格
    input = input.replace(/\s/g, '');
    
    // 如果输入是JSON字符串，直接解析
    if (input.startsWith('[') && input.endsWith(']')) {
      try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // 如果JSON解析失败，继续使用手动解析
      }
    }
    
    // 验证输入格式 [数字,数字,null,...]
    const regex = /^\[((\d+|null)(,(\d+|null))*)?\]$/;
    if (!regex.test(input)) {
      throw new Error('输入格式不正确');
    }
    
    // 移除括号并分割成数组
    input = input.substring(1, input.length - 1);
    if (!input) return [];
    
    // 解析数组内容
    return input.split(',').map(item => {
      if (item === 'null') return null;
      return parseInt(item, 10);
    });
  } catch (error) {
    throw new Error('解析失败：' + (error as Error).message);
  }
};

/**
 * 将数组转换为TreeNode对象
 */
export const arrayToTreeNode = (arr: (number | null)[]): TreeNode | null => {
  if (!arr.length || arr[0] === null) return null;
  
  // 创建所有节点
  const nodes: (TreeNode | null)[] = arr.map(val => {
    if (val === null) return null;
    return {
      val,
      left: null,
      right: null,
      id: Math.random().toString(36).substring(2, 10) // 添加随机ID用于UI渲染
    };
  });
  
  // 建立父子关系
  for (let i = 0; i < arr.length; i++) {
    if (nodes[i] === null) continue;
    
    // 左子节点
    const leftIdx = 2 * i + 1;
    if (leftIdx < nodes.length) {
      nodes[i]!.left = nodes[leftIdx];
    }
    
    // 右子节点
    const rightIdx = 2 * i + 2;
    if (rightIdx < nodes.length) {
      nodes[i]!.right = nodes[rightIdx];
    }
  }
  
  return nodes[0];
};

/**
 * 生成随机二叉树数组
 */
export const generateRandomTree = (maxDepth: number = 3, nullProbability: number = 0.3): (number | null)[] => {
  const result: (number | null)[] = [];
  
  // 生成根节点
  result.push(Math.floor(Math.random() * 9) + 1); // 1-9之间的数字
  
  const totalNodes = Math.pow(2, maxDepth) - 1;
  for (let i = 1; i < totalNodes; i++) {
    // 如果父节点是null，子节点也应该是null
    const parentIdx = Math.floor((i - 1) / 2);
    if (result[parentIdx] === null) {
      result.push(null);
      continue;
    }
    
    // 随机决定是否为null
    if (Math.random() < nullProbability) {
      result.push(null);
    } else {
      result.push(Math.floor(Math.random() * 9) + 1); // 1-9之间的数字
    }
  }
  
  // 移除末尾的null，使树看起来更整洁
  while (result[result.length - 1] === null) {
    result.pop();
  }
  
  return result;
};

/**
 * 合并两棵二叉树
 * LeetCode 617: https://leetcode.com/problems/merge-two-binary-trees/
 */
export const mergeTrees = (t1: TreeNode | null, t2: TreeNode | null): TreeNode | null => {
  // 如果一个节点为空，返回另一个节点
  if (!t1) return t2;
  if (!t2) return t1;
  
  // 合并当前节点，值相加
  const merged: TreeNode = {
    val: t1.val + t2.val,
    left: null,
    right: null,
    id: Math.random().toString(36).substring(2, 10)
  };
  
  // 递归合并左右子树
  merged.left = mergeTrees(t1.left, t2.left);
  merged.right = mergeTrees(t1.right, t2.right);
  
  return merged;
};

// 深拷贝函数，兼容不支持structuredClone的环境
function deepClone<T>(obj: T): T {
  if (typeof window !== 'undefined' && 'structuredClone' in window) {
    return (window as any).structuredClone(obj);
  }
  
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as any;
  }
  
  // 处理对象
  const clonedObj = {} as any;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clonedObj[key] = deepClone((obj as any)[key]);
    }
  }
  return clonedObj;
}

/**
 * 创建合并二叉树的动画步骤
 */
export const createMergeSteps = (t1: TreeNode | null, t2: TreeNode | null): {
  steps: { description: string, mergedTree: TreeNode | null }[],
  totalSteps: number
} => {
  console.log('创建合并步骤 - 输入树:', { 
    tree1: t1 ? `有效(节点值:${t1.val})` : '空', 
    tree2: t2 ? `有效(节点值:${t2.val})` : '空' 
  });
  
  const steps: { description: string, mergedTree: TreeNode | null }[] = [];
  
  // 标记已访问的节点路径，避免重复
  const visited = new Set<string>();
  
  // 重新实现mergeTrees函数，但是用于按步骤生成而非一次性合并
  const generateMergedTree = (root1: TreeNode | null, root2: TreeNode | null): TreeNode | null => {
    if (!root1 && !root2) return null;
    if (!root1) return deepClone(root2);
    if (!root2) return deepClone(root1);
    
    // 合并当前节点
    const result: TreeNode = {
      val: root1.val + root2.val,
      left: null,
      right: null,
      id: `merged-${Math.random().toString(36).substring(2, 10)}`
    };
    
    // 递归合并子节点
    result.left = generateMergedTree(root1.left, root2.left);
    result.right = generateMergedTree(root1.right, root2.right);
    
    return result;
  };
  
  // 递归生成合并步骤
  const generateSteps = (node1: TreeNode | null, node2: TreeNode | null, path: string = 'root'): TreeNode | null => {
    console.log(`处理路径 ${path}:`, { 
      node1: node1 ? `值:${node1.val}` : '空', 
      node2: node2 ? `值:${node2.val}` : '空',
      已访问: visited.has(path)
    });
    
    // 如果路径已处理过，跳过
    if (visited.has(path)) return null;
    visited.add(path);
    
    // 处理空节点情况
    if (!node1 && !node2) {
      steps.push({
        description: `路径 ${path} 处两棵树都是空节点，不需要合并`,
        mergedTree: null
      });
      return null;
    }
    
    // 如果一个节点为空，返回另一个节点的副本
    if (!node1) {
      const newNode: TreeNode = { 
        ...node2!, 
        id: `merged-${Math.random().toString(36).substring(2, 10)}`,
        left: null, 
        right: null 
      };
      
      // 重要：生成完整的合并树，而不仅仅是当前节点
      const fullMergedTree = generateMergedTree(null, node2);
      
      steps.push({
        description: `路径 ${path} 处左树是空节点，使用右树节点值 ${node2!.val}`,
        mergedTree: fullMergedTree
      });
      console.log(`路径 ${path} - 左空右有:`, { 
        合并结果: `节点值:${newNode.val}`, 
        步骤数: steps.length,
        合并树是否完整: fullMergedTree ? '是' : '否'
      });
      
      // 递归处理子节点
      if (node2!.left) newNode.left = generateSteps(null, node2!.left, `${path}.left`);
      if (node2!.right) newNode.right = generateSteps(null, node2!.right, `${path}.right`);
      
      return newNode;
    }
    
    if (!node2) {
      const newNode: TreeNode = { 
        ...node1!, 
        id: `merged-${Math.random().toString(36).substring(2, 10)}`,
        left: null, 
        right: null 
      };
      
      // 重要：生成完整的合并树，而不仅仅是当前节点
      const fullMergedTree = generateMergedTree(node1, null);
      
      steps.push({
        description: `路径 ${path} 处右树是空节点，使用左树节点值 ${node1!.val}`,
        mergedTree: fullMergedTree
      });
      console.log(`路径 ${path} - 左有右空:`, { 
        合并结果: `节点值:${newNode.val}`, 
        步骤数: steps.length,
        合并树是否完整: fullMergedTree ? '是' : '否'
      });
      
      // 递归处理子节点
      if (node1!.left) newNode.left = generateSteps(node1!.left, null, `${path}.left`);
      if (node1!.right) newNode.right = generateSteps(node1!.right, null, `${path}.right`);
      
      return newNode;
    }
    
    // 两个节点都不为空，合并节点值
    const mergedValue = node1.val + node2.val;
    const newNode: TreeNode = {
      val: mergedValue,
      left: null,
      right: null,
      id: `merged-${Math.random().toString(36).substring(2, 10)}`
    };
    
    // 重要：生成到当前路径为止的完整合并树
    // 创建一个临时的合并树
    const tempMergedTree = generateMergedTree(node1, node2);
    
    steps.push({
      description: `在路径 ${path} 处合并节点值: ${node1.val} + ${node2.val} = ${mergedValue}`,
      mergedTree: tempMergedTree
    });
    console.log(`路径 ${path} - 两边都有:`, { 
      合并结果: `${node1.val} + ${node2.val} = ${mergedValue}`, 
      步骤数: steps.length,
      合并树是否完整: tempMergedTree ? '是' : '否'
    });
    
    // 递归处理左右子树
    newNode.left = generateSteps(node1.left, node2.left, `${path}.left`);
    newNode.right = generateSteps(node1.right, node2.right, `${path}.right`);
    
    return newNode;
  };
  
  // 生成合并步骤
  const finalTree = generateSteps(t1, t2);
  
  // 添加完成步骤
  steps.push({
    description: '合并完成！',
    mergedTree: finalTree // 使用最终的完整合并树
  });
  
  console.log('合并步骤生成完成:', { 
    总步骤数: steps.length,
    最终树: finalTree ? `有效(节点值:${finalTree.val})` : '空'
  });
  
  return {
    steps,
    totalSteps: steps.length
  };
}; 