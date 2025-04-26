import { TreeNode } from '../types';

// 创建边的ID
export const getEdgeId = (source: TreeNode, target: TreeNode): string => {
  return `${source.id}-${target.id}`;
};

// 计算树的所有边
export const calculateEdges = (root: TreeNode | null, edges: [TreeNode, TreeNode][] = []): [TreeNode, TreeNode][] => {
  if (!root) return edges;
  
  if (root.left) {
    edges.push([root, root.left]);
    calculateEdges(root.left, edges);
  }
  
  if (root.right) {
    edges.push([root, root.right]);
    calculateEdges(root.right, edges);
  }
  
  return edges;
};

// 收集所有树节点
export const collectNodes = (root: TreeNode | null, nodes: TreeNode[] = []): TreeNode[] => {
  if (!root) return nodes;
  
  nodes.push(root);
  collectNodes(root.left, nodes);
  collectNodes(root.right, nodes);
  
  return nodes;
};

// 创建节点位置计算函数
export const createPositionCalculator = (
  dimensions: { width: number, height: number }, 
  scaleFactor: number
) => {
  const smallScreen = dimensions.width < 600;
  const isMobile = dimensions.width < 480;
  
  // 区域调整因子
  const areaWidthFactor = isMobile ? 0.42 : (smallScreen ? 0.38 : 0.35);
  const areaHeightFactor = isMobile ? 0.3 : (smallScreen ? 0.34 : 0.38);
  const mergedAreaWidthFactor = isMobile ? 0.7 : (smallScreen ? 0.65 : 0.6);
  const mergedAreaHeightFactor = isMobile ? 0.42 : (smallScreen ? 0.45 : 0.5);
  
  // 计算区域位置
  const areas = {
    tree1: {
      x: dimensions.width * 0.05,
      y: dimensions.height * 0.05,
      width: dimensions.width * areaWidthFactor,
      height: dimensions.height * areaHeightFactor
    },
    tree2: {
      x: dimensions.width * (0.95 - areaWidthFactor),
      y: dimensions.height * 0.05,
      width: dimensions.width * areaWidthFactor,
      height: dimensions.height * areaHeightFactor
    },
    merged: {
      x: dimensions.width * (0.5 - mergedAreaWidthFactor/2),
      y: dimensions.height * (0.5 + (isMobile ? -0.1 : 0)),
      width: dimensions.width * mergedAreaWidthFactor,
      height: dimensions.height * mergedAreaHeightFactor
    }
  };
  
  // 根据不同的屏幕大小调整节点位置
  const getAdjustedPosition = (baseX: number, baseY: number, area: 'tree1' | 'tree2' | 'merged') => {
    // 更紧凑的布局系数
    const compactFactor = isMobile ? 0.65 : (smallScreen ? 0.75 : 0.85);
    
    let x, y;
    const areaInfo = areas[area];
    const centerX = areaInfo.x + areaInfo.width / 2;
    const topY = areaInfo.y + 40;
    
    switch (area) {
      case 'tree1': {
        // 使用正确的从左到右的布局，基于二叉树结构
        const offsetX = (baseX - 100) * compactFactor * 0.8;
        x = centerX + offsetX * scaleFactor;
        y = topY + baseY * 0.6 * scaleFactor;
        break;
      }
      case 'tree2': {
        // 使用正确的从左到右的布局，基于二叉树结构
        const offsetX = (baseX - 200) * compactFactor * 0.8;
        x = centerX + offsetX * scaleFactor;
        y = topY + baseY * 0.6 * scaleFactor;
        break;
      }
      case 'merged': {
        // 合并树使用完整的二叉树布局
        const offsetX = (baseX - 300) * compactFactor * 0.7;
        x = centerX + offsetX * scaleFactor;
        y = areaInfo.y + 30 + baseY * 0.5 * scaleFactor;
        break;
      }
      default:
        x = baseX * scaleFactor;
        y = baseY * scaleFactor;
    }
    
    return { x, y };
  };
  
  return {
    getAdjustedPosition,
    areas
  };
};

// 计算字体大小
export const calculateFontSizes = (dimensions: { width: number, height: number }) => {
  const smallScreen = dimensions.width < 600;
  const isMobile = dimensions.width < 480;
  
  return {
    titleFontSize: Math.max(12, Math.min(18, dimensions.width * (smallScreen ? 0.03 : 0.025))),
    messageFontSize: Math.max(12, Math.min(16, dimensions.width * (smallScreen ? 0.025 : 0.02))),
    labelFontSize: Math.max(10, Math.min(14, dimensions.width * (smallScreen ? 0.02 : 0.015))),
    legendFontSize: Math.max(8, Math.min(12, dimensions.width * (smallScreen ? 0.018 : 0.012))),
    smallScreen,
    isMobile
  };
}; 