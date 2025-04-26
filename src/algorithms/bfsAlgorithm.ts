import { TreeNode, AnimationStep } from '../types';
import { createTreeNode } from '../utils/treeUtils';

/**
 * 生成BFS算法的动画步骤
 * 完全按照动画分镜文档要求重新实现
 */
export function generateBFSAnimationSteps(
  root1: TreeNode | null,
  root2: TreeNode | null
): AnimationStep[] {
  const steps: AnimationStep[] = [];
  const nodesState = new Map<string, { val: number, color: string, scale: number, opacity: number }>();
  const edgesState = new Map<string, { stroke: string, width: number, opacity: number }>();
  
  // 阶段1：初始化与特殊情况
  // 步骤1.1：展示问题
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "初始化：准备使用BFS（广度优先搜索）合并两棵树"
    },
    description: "我们将使用BFS（广度优先搜索）合并两棵树。蓝色表示第一棵树，橙色表示第二棵树，绿色表示合并后的树。BFS会按层次遍历，先处理同一层的所有节点，再处理下一层。"
  });
  
  // 步骤1.2：检查空树情况
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "首先检查是否有空树"
    },
    description: "先检查两棵树是否有一棵为空。如果第一棵树为空，结果就是第二棵树；如果第二棵树为空，结果就是第一棵树。这是快捷处理，可以减少后续步骤。"
  });
  
  // 基本情况处理
  if (!root1) {
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
        message: "第一棵树为空，直接返回第二棵树"
      },
      description: "当整个第一棵树为空时，合并的结果就是第二棵树。无需进行任何合并操作，直接使用已有的树。"
    });
    return steps;
  }
  
  if (!root2) {
    if (root1?.id) {
      nodesState.set(root1.id, { 
        val: root1.val, 
        color: '#4285F4', // 蓝色
        scale: 1.2,
        opacity: 1
      });
    }
    
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: "第二棵树为空，直接返回第一棵树"
      },
      description: "当整个第二棵树为空时，合并的结果就是第一棵树。无需进行任何合并操作，直接使用已有的树。"
    });
    return steps;
  }
  
  // 阶段2：处理根节点
  // 步骤2.1：合并根节点
  // 高亮两个根节点
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
  
  // 创建合并后的根节点
  const mergedRoot = createTreeNode(root1.val + root2.val, `merged-${root1.id}-${root2.id}`);
  
  // 添加合并根节点状态
  nodesState.set(mergedRoot.id!, { 
    val: mergedRoot.val, 
    color: '#0F9D58', // 绿色
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
    description: `首先合并两棵树的根节点，将它们的值相加：${root1.val} + ${root2.val} = ${mergedRoot.val}。这是合并二叉树算法的核心步骤，两个对应位置的节点值相加形成新节点。`
  });
  
  // 恢复节点状态
  if (root1?.id) {
    nodesState.set(root1.id, { 
      val: root1.val, 
      color: '#4285F4', // 蓝色
      scale: 1,
      opacity: 1
    });
  }
  
  if (root2?.id) {
    nodesState.set(root2.id, { 
      val: root2.val, 
      color: '#F4B400', // 橙色
      scale: 1,
      opacity: 1
    });
  }
  
  nodesState.set(mergedRoot.id!, { 
    val: mergedRoot.val, 
    color: '#0F9D58', // 绿色
    scale: 1,
    opacity: 1
  });
  
  // 步骤2.2：初始化三个队列
  // 可视化队列状态（展示的是概念，不需要真的显示队列）
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "初始化三个队列，分别存放两棵原树和合并树的节点"
    },
    description: "BFS算法使用队列来存储待处理的节点。我们创建三个队列分别存放：1) 第一棵树的节点 2) 第二棵树的节点 3) 合并后的树的节点。这样可以同步处理对应位置的节点。"
  });
  
  // 初始化队列
  const queue1: (TreeNode | null)[] = [root1];
  const queue2: (TreeNode | null)[] = [root2];
  const mergedQueue: TreeNode[] = [mergedRoot];
  
  // 层次计数，用于标记层次
  let currentLevel = 0;
  
  // 阶段3和4：BFS逐层处理与队列迭代处理
  while (mergedQueue.length > 0) {
    const size = mergedQueue.length; // 当前层的节点数
    currentLevel++;
    
    // 更新队列状态
    steps.push({
      snapshot: {
        timestamp: steps.length * 1000,
        nodesState: new Map(nodesState),
        edgesState: new Map(edgesState),
        message: `开始处理第${currentLevel}层的节点`
      },
      description: `BFS按层次处理，现在开始处理第${currentLevel}层的所有节点。我们将从队列中取出这一层的每个节点，并处理它们的子节点。`
    });
    
    // 处理当前层的所有节点
    for (let i = 0; i < size; i++) {
      const current = mergedQueue.shift()!;
      const node1 = queue1.shift();
      const node2 = queue2.shift();
      
      // 步骤3.1：从队列取出节点
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: "从队列中取出一组节点进行处理"
        },
        description: "从三个队列的队首取出对应的节点，高亮显示。BFS的特点是按层次遍历，先处理完当前层的所有节点，再进入下一层。"
      });
      
      // 高亮当前处理的节点
      if (current.id) {
        nodesState.set(current.id, { 
          val: current.val, 
          color: '#0F9D58', // 绿色
          scale: 1.2,
          opacity: 1
        });
      }
      
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
      
      // 步骤3.2：处理左子节点
      // 先检查是否有左子节点
      const hasLeftChild1 = node1 && node1.left;
      const hasLeftChild2 = node2 && node2.left;
      
      if (hasLeftChild1 || hasLeftChild2) {
        // 高亮左子树方向
        steps.push({
          snapshot: {
            timestamp: steps.length * 1000,
            nodesState: new Map(nodesState),
            edgesState: new Map(edgesState),
            message: "处理左子节点：检查和合并"
          },
          description: "现在检查两棵树在当前位置的左子节点。如果都存在，合并它们；如果只有一个存在，直接使用它；如果都不存在，结果为空。"
        });
        
        // 高亮左子节点
        if (hasLeftChild1 && node1!.left!.id) {
          nodesState.set(node1!.left!.id, { 
            val: node1!.left!.val, 
            color: '#4285F4', // 蓝色
            scale: 1.2,
            opacity: 0.7
          });
        }
        
        if (hasLeftChild2 && node2!.left!.id) {
          nodesState.set(node2!.left!.id, { 
            val: node2!.left!.val, 
            color: '#F4B400', // 橙色
            scale: 1.2,
            opacity: 0.7
          });
        }
        
        let mergedLeft: TreeNode | null = null;
        
        // 根据不同情况处理左子节点
        if (hasLeftChild1 && hasLeftChild2) {
          // 两个左子节点都存在，合并它们
          const leftVal1 = node1!.left!.val;
          const leftVal2 = node2!.left!.val;
          
          mergedLeft = createTreeNode(
            leftVal1 + leftVal2,
            `merged-${node1!.left!.id || 'null'}-${node2!.left!.id || 'null'}`
          );
          
          // 添加合并左子节点状态
          nodesState.set(mergedLeft.id!, { 
            val: mergedLeft.val, 
            color: '#0F9D58', // 绿色
            scale: 1.2,
            opacity: 0.7
          });
          
          // 添加边
          if (current.id && mergedLeft.id) {
            edgesState.set(`${current.id}-${mergedLeft.id}`, {
              stroke: '#0F9D58', // 绿色
              width: 1.5,
              opacity: 0.7
            });
          }
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: `合并左子节点：${leftVal1} + ${leftVal2} = ${mergedLeft.val}`
            },
            description: `处理左子节点，将两棵树对应位置的节点值相加：${leftVal1} + ${leftVal2} = ${mergedLeft.val}。BFS会将这个节点加入队列，稍后处理它的子节点。`
          });
          
          // 将节点添加到队列
          queue1.push(node1!.left);
          queue2.push(node2!.left);
          mergedQueue.push(mergedLeft);
          
          // 步骤3.3：将左子节点加入队列
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: "将左子节点加入队列，等待后续处理"
            },
            description: "将左子节点加入队列，之后会按照广度优先的顺序处理。BFS会先处理完同一层的所有节点，再进入下一层，这与DFS的深度优先不同。"
          });
          
        } else if (hasLeftChild1) {
          // 步骤4.6：处理特殊情况 - 只有一个子节点存在（左子树）
          // 只有第一棵树有左子节点
          mergedLeft = createTreeNode(
            node1!.left!.val,
            `merged-${node1!.left!.id || 'null'}-null`
          );
          
          // 添加合并左子节点状态
          nodesState.set(mergedLeft.id!, { 
            val: mergedLeft.val, 
            color: '#0F9D58', // 绿色
            scale: 1.2,
            opacity: 0.7
          });
          
          // 添加边
          if (current.id && mergedLeft.id) {
            edgesState.set(`${current.id}-${mergedLeft.id}`, {
              stroke: '#0F9D58', // 绿色
              width: 1.5,
              opacity: 0.7
            });
          }
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: `特殊情况：只有第一棵树有左子节点，值为${node1!.left!.val}`
            },
            description: "在这种情况下，我们直接使用存在的子节点，无需合并。在BFS中，我们只将这种非空节点及其对应位置的节点加入队列。"
          });
          
          // 将节点添加到队列
          queue1.push(node1!.left);
          queue2.push(null);
          mergedQueue.push(mergedLeft);
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: "将左子节点加入队列，等待后续处理"
            },
            description: "将左子节点加入队列，对应的第二棵树位置放入null。BFS会继续按层次处理所有节点。"
          });
          
        } else if (hasLeftChild2) {
          // 只有第二棵树有左子节点
          mergedLeft = createTreeNode(
            node2!.left!.val,
            `merged-null-${node2!.left!.id || 'null'}`
          );
          
          // 添加合并左子节点状态
          nodesState.set(mergedLeft.id!, { 
            val: mergedLeft.val, 
            color: '#0F9D58', // 绿色
            scale: 1.2,
            opacity: 0.7
          });
          
          // 添加边
          if (current.id && mergedLeft.id) {
            edgesState.set(`${current.id}-${mergedLeft.id}`, {
              stroke: '#0F9D58', // 绿色
              width: 1.5,
              opacity: 0.7
            });
          }
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: `特殊情况：只有第二棵树有左子节点，值为${node2!.left!.val}`
            },
            description: "在这种情况下，我们直接使用存在的子节点，无需合并。在BFS中，我们只将这种非空节点及其对应位置的节点加入队列。"
          });
          
          // 将节点添加到队列
          queue1.push(null);
          queue2.push(node2!.left);
          mergedQueue.push(mergedLeft);
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: "将左子节点加入队列，等待后续处理"
            },
            description: "将左子节点加入队列，对应的第一棵树位置放入null。BFS会继续按层次处理所有节点。"
          });
        }
        
        // 更新左子节点关系
        current.left = mergedLeft;
        
        // 恢复左子节点的状态
        if (hasLeftChild1 && node1!.left!.id) {
          nodesState.set(node1!.left!.id, { 
            val: node1!.left!.val, 
            color: '#4285F4', // 蓝色
            scale: 1,
            opacity: 1
          });
        }
        
        if (hasLeftChild2 && node2!.left!.id) {
          nodesState.set(node2!.left!.id, { 
            val: node2!.left!.val, 
            color: '#F4B400', // 橙色
            scale: 1,
            opacity: 1
          });
        }
        
        if (mergedLeft && mergedLeft.id) {
          nodesState.set(mergedLeft.id, { 
            val: mergedLeft.val, 
            color: '#0F9D58', // 绿色
            scale: 1,
            opacity: 1
          });
          
          if (current.id) {
            edgesState.set(`${current.id}-${mergedLeft.id}`, {
              stroke: '#0F9D58', // 绿色
              width: 1,
              opacity: 1
            });
          }
        }
      } else {
        // 步骤4.7：处理特殊情况 - 两个子节点都不存在（左子树）
        steps.push({
          snapshot: {
            timestamp: steps.length * 1000,
            nodesState: new Map(nodesState),
            edgesState: new Map(edgesState),
            message: "特殊情况：两侧树都没有左子节点"
          },
          description: "当两侧树在某个位置都没有子节点时，结果也没有对应子节点，无需加入队列，这样可以减少不必要的遍历步骤。"
        });
      }
      
      // 步骤3.4：处理右子节点
      // 先检查是否有右子节点
      const hasRightChild1 = node1 && node1.right;
      const hasRightChild2 = node2 && node2.right;
      
      if (hasRightChild1 || hasRightChild2) {
        // 高亮右子树方向
        steps.push({
          snapshot: {
            timestamp: steps.length * 1000,
            nodesState: new Map(nodesState),
            edgesState: new Map(edgesState),
            message: "处理右子节点：检查和合并"
          },
          description: "类似地，现在处理当前节点的右子节点。右子节点与左子节点使用相同的合并规则。"
        });
        
        // 高亮右子节点
        if (hasRightChild1 && node1!.right!.id) {
          nodesState.set(node1!.right!.id, { 
            val: node1!.right!.val, 
            color: '#4285F4', // 蓝色
            scale: 1.2,
            opacity: 0.7
          });
        }
        
        if (hasRightChild2 && node2!.right!.id) {
          nodesState.set(node2!.right!.id, { 
            val: node2!.right!.val, 
            color: '#F4B400', // 橙色
            scale: 1.2,
            opacity: 0.7
          });
        }
        
        let mergedRight: TreeNode | null = null;
        
        // 根据不同情况处理右子节点
        if (hasRightChild1 && hasRightChild2) {
          // 两个右子节点都存在，合并它们
          const rightVal1 = node1!.right!.val;
          const rightVal2 = node2!.right!.val;
          
          mergedRight = createTreeNode(
            rightVal1 + rightVal2,
            `merged-${node1!.right!.id || 'null'}-${node2!.right!.id || 'null'}`
          );
          
          // 添加合并右子节点状态
          nodesState.set(mergedRight.id!, { 
            val: mergedRight.val, 
            color: '#0F9D58', // 绿色
            scale: 1.2,
            opacity: 0.7
          });
          
          // 添加边
          if (current.id && mergedRight.id) {
            edgesState.set(`${current.id}-${mergedRight.id}`, {
              stroke: '#0F9D58', // 绿色
              width: 1.5,
              opacity: 0.7
            });
          }
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: `合并右子节点：${rightVal1} + ${rightVal2} = ${mergedRight.val}`
            },
            description: `现在处理右子节点，将两棵树对应位置的节点值相加：${rightVal1} + ${rightVal2} = ${mergedRight.val}。BFS会将这个节点加入队列，稍后处理它的子节点。`
          });
          
          // 将节点添加到队列
          queue1.push(node1!.right);
          queue2.push(node2!.right);
          mergedQueue.push(mergedRight);
          
          // 步骤3.5：将右子节点加入队列
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: "将右子节点加入队列，等待后续处理"
            },
            description: "将右子节点加入队列。在广度优先搜索中，我们总是先完全处理当前层级的节点，再移动到下一层。"
          });
          
        } else if (hasRightChild1) {
          // 只有第一棵树有右子节点
          mergedRight = createTreeNode(
            node1!.right!.val,
            `merged-${node1!.right!.id || 'null'}-null`
          );
          
          // 添加合并右子节点状态
          nodesState.set(mergedRight.id!, { 
            val: mergedRight.val, 
            color: '#0F9D58', // 绿色
            scale: 1.2,
            opacity: 0.7
          });
          
          // 添加边
          if (current.id && mergedRight.id) {
            edgesState.set(`${current.id}-${mergedRight.id}`, {
              stroke: '#0F9D58', // 绿色
              width: 1.5,
              opacity: 0.7
            });
          }
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: `特殊情况：只有第一棵树有右子节点，值为${node1!.right!.val}`
            },
            description: "在这种情况下，我们直接使用存在的子节点，无需合并。在BFS中，我们只将这种非空节点及其对应位置的节点加入队列。"
          });
          
          // 将节点添加到队列
          queue1.push(node1!.right);
          queue2.push(null);
          mergedQueue.push(mergedRight);
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: "将右子节点加入队列，等待后续处理"
            },
            description: "将右子节点加入队列，对应的第二棵树位置放入null。BFS会继续按层次处理所有节点。"
          });
          
        } else if (hasRightChild2) {
          // 只有第二棵树有右子节点
          mergedRight = createTreeNode(
            node2!.right!.val,
            `merged-null-${node2!.right!.id || 'null'}`
          );
          
          // 添加合并右子节点状态
          nodesState.set(mergedRight.id!, { 
            val: mergedRight.val, 
            color: '#0F9D58', // 绿色
            scale: 1.2,
            opacity: 0.7
          });
          
          // 添加边
          if (current.id && mergedRight.id) {
            edgesState.set(`${current.id}-${mergedRight.id}`, {
              stroke: '#0F9D58', // 绿色
              width: 1.5,
              opacity: 0.7
            });
          }
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: `特殊情况：只有第二棵树有右子节点，值为${node2!.right!.val}`
            },
            description: "在这种情况下，我们直接使用存在的子节点，无需合并。在BFS中，我们只将这种非空节点及其对应位置的节点加入队列。"
          });
          
          // 将节点添加到队列
          queue1.push(null);
          queue2.push(node2!.right);
          mergedQueue.push(mergedRight);
          
          steps.push({
            snapshot: {
              timestamp: steps.length * 1000,
              nodesState: new Map(nodesState),
              edgesState: new Map(edgesState),
              message: "将右子节点加入队列，等待后续处理"
            },
            description: "将右子节点加入队列，对应的第一棵树位置放入null。BFS会继续按层次处理所有节点。"
          });
        }
        
        // 更新右子节点关系
        current.right = mergedRight;
        
        // 恢复右子节点的状态
        if (hasRightChild1 && node1!.right!.id) {
          nodesState.set(node1!.right!.id, { 
            val: node1!.right!.val, 
            color: '#4285F4', // 蓝色
            scale: 1,
            opacity: 1
          });
        }
        
        if (hasRightChild2 && node2!.right!.id) {
          nodesState.set(node2!.right!.id, { 
            val: node2!.right!.val, 
            color: '#F4B400', // 橙色
            scale: 1,
            opacity: 1
          });
        }
        
        if (mergedRight && mergedRight.id) {
          nodesState.set(mergedRight.id, { 
            val: mergedRight.val, 
            color: '#0F9D58', // 绿色
            scale: 1,
            opacity: 1
          });
          
          if (current.id) {
            edgesState.set(`${current.id}-${mergedRight.id}`, {
              stroke: '#0F9D58', // 绿色
              width: 1,
              opacity: 1
            });
          }
        }
      } else {
        // 两个子节点都不存在（右子树）
        steps.push({
          snapshot: {
            timestamp: steps.length * 1000,
            nodesState: new Map(nodesState),
            edgesState: new Map(edgesState),
            message: "特殊情况：两侧树都没有右子节点"
          },
          description: "当两侧树在某个位置都没有子节点时，结果也没有对应子节点，无需加入队列，这样可以减少不必要的遍历步骤。"
        });
      }
      
      // 恢复当前节点状态
      if (current.id) {
        nodesState.set(current.id, { 
          val: current.val, 
          color: '#0F9D58', // 绿色
          scale: 1,
          opacity: 1
        });
      }
      
      if (node1?.id) {
        nodesState.set(node1.id, { 
          val: node1.val, 
          color: '#4285F4', // 蓝色
          scale: 1,
          opacity: 1
        });
      }
      
      if (node2?.id) {
        nodesState.set(node2.id, { 
          val: node2.val, 
          color: '#F4B400', // 橙色
          scale: 1,
          opacity: 1
        });
      }
    }
    
    // 阶段5：层序遍历的视觉强调
    if (mergedQueue.length > 0) {
      steps.push({
        snapshot: {
          timestamp: steps.length * 1000,
          nodesState: new Map(nodesState),
          edgesState: new Map(edgesState),
          message: `第${currentLevel}层处理完毕，进入第${currentLevel+1}层`
        },
        description: `注意BFS算法如何逐层完成处理。这里我们已完成第${currentLevel}层的所有节点，现在处理第${currentLevel+1}层。这种层序遍历是BFS的核心特征。`
      });
    }
  }
  
  // 步骤5.2：队列变空的检查
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "队列为空，BFS遍历完成"
    },
    description: "BFS算法通过检查队列是否为空来确定是否完成所有节点的遍历。当队列为空时，表示我们已经处理完所有需要合并的节点。"
  });
  
  // 阶段6：完成合并
  steps.push({
    snapshot: {
      timestamp: steps.length * 1000,
      nodesState: new Map(nodesState),
      edgesState: new Map(edgesState),
      message: "合并完成！"
    },
    description: "两棵二叉树合并完成！我们使用广度优先搜索(BFS)遍历了两棵树的所有节点，按层次依次处理，并按照规则将它们合并成了一棵新的二叉树。回顾合并规则：1) 如果两个节点都存在，值相加；2) 如果只有一个节点存在，直接使用该节点；3) 如果两个节点都不存在，结果为空。"
  });
  
  return steps;
} 