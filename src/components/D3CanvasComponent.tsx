import React, { useRef, useEffect, useState, ReactElement } from 'react';
import { useAppSelector } from '../store/hooks';
import { TreeNode } from '../types';
import { RootState } from '../store';

// 节点位置接口
interface NodePosition {
  x: number;
  y: number;
}

// 边数据接口
interface EdgeData {
  source: NodePosition;
  target: NodePosition;
  id: string;
}

const D3CanvasComponent: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  
  // 获取树数据
  const { tree1, tree2, steps, currentStep } = useAppSelector((state: RootState) => state.tree);
  const currentMergedTree = steps[currentStep]?.mergedTree || null;
  
  // 更新SVG尺寸
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.parentElement?.getBoundingClientRect() || { width: 800, height: 600 };
        setDimensions({ width, height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  // 收集所有节点
  const collectNodes = (tree: TreeNode | null): TreeNode[] => {
    const nodes: TreeNode[] = [];
    if (!tree) return nodes;
    
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      nodes.push(node);
      traverse(node.left);
      traverse(node.right);
    };
    
    traverse(tree);
    return nodes;
  };
  
  // 计算树深度
  const getTreeHeight = (tree: TreeNode | null): number => {
    if (!tree) return 0;
    return 1 + Math.max(getTreeHeight(tree.left), getTreeHeight(tree.right));
  };
  
  // 计算树宽度
  const getTreeWidth = (tree: TreeNode | null): number => {
    if (!tree) return 0;
    const count = (node: TreeNode | null): number => {
      if (!node) return 0;
      return 1 + count(node.left) + count(node.right);
    };
    return count(tree);
  };
  
  // 动态计算最佳缩放比例
  useEffect(() => {
    if (!tree1 && !tree2) return;
    
    const tree1Height = getTreeHeight(tree1);
    const tree2Height = getTreeHeight(tree2);
    const maxTreeHeight = Math.max(tree1Height, tree2Height);
    
    const tree1Width = getTreeWidth(tree1);
    const tree2Width = getTreeWidth(tree2);
    const maxTreeWidth = Math.max(tree1Width, tree2Width);
    
    // 计算合理的缩放比例
    const availableHeight = dimensions.height * 0.8; // 留出20%空间
    const availableWidth = dimensions.width * 0.8;
    
    const heightScale = maxTreeHeight ? availableHeight / (maxTreeHeight * 100) : 1;
    const widthScale = maxTreeWidth ? availableWidth / (maxTreeWidth * 80) : 1;
    
    // 选择较小的缩放比例确保完全显示
    const newScale = Math.min(heightScale, widthScale, 1);
    setScale(newScale);
  }, [tree1, tree2, dimensions]);
  
  // 计算节点位置
  const calculatePositions = (tree: TreeNode | null, startX: number, width: number): Map<string, NodePosition> => {
    const positions = new Map<string, NodePosition>();
    if (!tree) return positions;
    
    // 计算树高度
    const height = getTreeHeight(tree);
    const levelHeight = Math.min(100, dimensions.height / (height + 1.5)) * scale; // 根据缩放调整垂直间距
    
    // 递归计算节点位置
    const calculateNodePosition = (node: TreeNode | null, depth: number, left: number, right: number) => {
      if (!node) return;
      
      const x = (left + right) / 2;
      const y = (depth + 1) * levelHeight;
      
      // 使用节点ID或生成随机ID
      const nodeId = node.id || `node-${Math.random()}`;
      positions.set(nodeId, { x, y });
      
      const gap = right - left;
      if (node.left) calculateNodePosition(node.left, depth + 1, left, left + gap / 2);
      if (node.right) calculateNodePosition(node.right, depth + 1, left + gap / 2, right);
    };
    
    calculateNodePosition(tree, 0, startX, startX + width);
    return positions;
  };
  
  // 计算所有边
  const calculateEdges = (
    tree: TreeNode | null, 
    positions: Map<string, NodePosition>
  ): EdgeData[] => {
    const edges: EdgeData[] = [];
    if (!tree) return edges;
    
    const traverse = (node: TreeNode | null) => {
      if (!node) return;
      
      const nodeId = node.id || '';
      const nodePos = positions.get(nodeId);
      
      if (nodePos) {
        // 左子节点边
        if (node.left) {
          const leftId = node.left.id || '';
          const leftPos = positions.get(leftId);
          
          if (leftPos) {
            edges.push({
              source: nodePos,
              target: leftPos,
              id: `${nodeId}-${leftId}`
            });
          }
        }
        
        // 右子节点边
        if (node.right) {
          const rightId = node.right.id || '';
          const rightPos = positions.get(rightId);
          
          if (rightPos) {
            edges.push({
              source: nodePos,
              target: rightPos,
              id: `${nodeId}-${rightId}`
            });
          }
        }
      }
      
      traverse(node.left);
      traverse(node.right);
    };
    
    traverse(tree);
    return edges;
  };
  
  // 生成树视图
  const renderTree = () => {
    // 计算布局
    const tree1Width = dimensions.width * 0.32;
    const tree2Width = dimensions.width * 0.32;
    const mergedWidth = dimensions.width * 0.32;
    
    const tree1StartX = dimensions.width * 0.05;
    const tree2StartX = dimensions.width - tree2Width - dimensions.width * 0.05;
    const mergedStartX = (dimensions.width - mergedWidth) / 2;
    
    // 计算节点位置
    const tree1Positions = calculatePositions(tree1, tree1StartX, tree1Width);
    const tree2Positions = calculatePositions(tree2, tree2StartX, tree2Width);
    const mergedPositions = calculatePositions(currentMergedTree, mergedStartX, mergedWidth);
    
    // 收集节点
    const tree1Nodes = collectNodes(tree1);
    const tree2Nodes = collectNodes(tree2);
    const mergedNodes = collectNodes(currentMergedTree);
    
    // 计算边
    const tree1Edges = calculateEdges(tree1, tree1Positions);
    const tree2Edges = calculateEdges(tree2, tree2Positions);
    const mergedEdges = calculateEdges(currentMergedTree, mergedPositions);
    
    // 渲染元素
    const elements: ReactElement[] = [];
    
    // 添加箭头定义
    elements.push(
      <defs key="arrow-def">
        <marker
          id="arrowhead"
          viewBox="0 -5 10 10"
          refX={8}
          refY={0}
          orient="auto"
          markerWidth={6}
          markerHeight={6}
        >
          <path d="M0,-5L10,0L0,5" fill="#999" />
        </marker>
      </defs>
    );
    
    // 添加标题
    elements.push(
      <text key="title-tree1" x={tree1StartX + tree1Width / 2} y={30} 
        textAnchor="middle" fontSize="16px" fontWeight="bold" fill="#4285F4">
        树 1
      </text>
    );
    
    elements.push(
      <text key="title-tree2" x={tree2StartX + tree2Width / 2} y={30} 
        textAnchor="middle" fontSize="16px" fontWeight="bold" fill="#F4B400">
        树 2
      </text>
    );
    
    elements.push(
      <text key="title-merged" x={mergedStartX + mergedWidth / 2} y={30} 
        textAnchor="middle" fontSize="16px" fontWeight="bold" fill="#0F9D58">
        合并后的树
      </text>
    );
    
    // 渲染边
    const renderEdges = (edges: EdgeData[], color: string, strokeWidth: number, keyPrefix: string) => {
      return edges.map((edge, index) => {
        const key = `${keyPrefix}-edge-${index}`;
        const dx = edge.target.x - edge.source.x;
        const dy = edge.target.y - edge.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 1.2; // 调整曲线弧度
        
        const isHighlighted = currentStep > 0 && keyPrefix === 'merged';
        const edgeClasses = [
          'tree-edge',
          `${keyPrefix}-edge`,
          isHighlighted ? 'fade-in' : ''
        ].filter(Boolean).join(' ');
        
        return (
          <path
            key={key}
            d={`M${edge.source.x},${edge.source.y}A${dr},${dr} 0 0,1 ${edge.target.x},${edge.target.y}`}
            fill="none"
            stroke={color}
            strokeWidth={isHighlighted ? strokeWidth + 1 : strokeWidth}
            strokeOpacity={isHighlighted ? 0.9 : 0.4}
            className={edgeClasses}
          />
        );
      });
    };
    
    // 添加边
    elements.push(...renderEdges(tree1Edges, "#4285F4", 2, "tree1"));
    elements.push(...renderEdges(tree2Edges, "#F4B400", 2, "tree2"));
    elements.push(...renderEdges(mergedEdges, "#0F9D58", 2, "merged"));
    
    // 渲染节点
    const renderNodes = (nodes: TreeNode[], positions: Map<string, NodePosition>, color: string, textColor: string, keyPrefix: string) => {
      return nodes.map((node, index) => {
        const pos = positions.get(node.id || '') || { x: 0, y: 0 };
        const nodeRadius = 20 * scale;
        const isActive = currentStep > 0 && keyPrefix === 'merged';
        
        // 当前步骤中要高亮的节点
        const isHighlighted = steps[currentStep]?.highlightedNodes?.includes(node.id || '') || false;
        const nodeFill = isHighlighted ? (keyPrefix === 'merged' ? '#4CAF50' : color) : color;
        const nodeOpacity = isActive ? 1 : (isHighlighted ? 0.9 : 0.7);
        
        const nodeClasses = [
          'tree-node',
          `${keyPrefix}-node`,
          isHighlighted ? 'highlighted' : ''
        ].filter(Boolean).join(' ');
        
        const circleClasses = [
          'node-circle',
          `${keyPrefix}-circle`,
          isHighlighted ? 'pulse' : ''
        ].filter(Boolean).join(' ');
        
        const textClasses = [
          'node-text',
          `${keyPrefix}-text`,
          isHighlighted && keyPrefix === 'merged' ? 'fade-in' : ''
        ].filter(Boolean).join(' ');
        
        return (
          <g 
            key={`${keyPrefix}-node-${index}`} 
            transform={`translate(${pos.x}, ${pos.y})`}
            className={nodeClasses}
          >
            <circle 
              r={nodeRadius} 
              fill={nodeFill} 
              stroke={isHighlighted ? "#000" : "#333"} 
              strokeWidth={isHighlighted ? 3 : 2} 
              opacity={nodeOpacity}
              className={circleClasses}
            />
            <text
              textAnchor="middle"
              dy="0.3em"
              fill={isHighlighted ? "#fff" : textColor}
              fontSize={`${(isHighlighted ? 16 : 14) * scale}px`}
              fontWeight={isHighlighted ? "bold" : "normal"}
              className={textClasses}
            >
              {node.val}
            </text>
          </g>
        );
      });
    };
    
    // 添加节点
    elements.push(...renderNodes(tree1Nodes, tree1Positions, "#E3F2FD", "#1A73E8", "tree1"));
    elements.push(...renderNodes(tree2Nodes, tree2Positions, "#FFF8E1", "#E37400", "tree2"));
    elements.push(...renderNodes(mergedNodes, mergedPositions, "#E8F5E9", "#0B8043", "merged"));
    
    return elements;
  };
  
  return (
    <div className="d3-canvas-container">
      <div className="zoom-controls">
        <button 
          className="zoom-btn" 
          onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))}
          title="缩小"
        >
          -
        </button>
        <span className="zoom-level">{Math.round(scale * 100)}%</span>
        <button 
          className="zoom-btn" 
          onClick={() => setScale(prev => Math.min(prev + 0.1, 1.5))}
          title="放大"
        >
          +
        </button>
      </div>
      
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {renderTree()}
      </svg>
    </div>
  );
};

export default D3CanvasComponent; 