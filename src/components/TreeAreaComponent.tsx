import React from 'react';
import { TreeNode } from '../types';
import TreeEdgeComponent from './TreeEdgeComponent';
import TreeNodeComponent from './TreeNodeComponent';

interface TreeAreaProps {
  title: string;
  titleColor: string;
  areaColor: string;
  borderColor: string;
  areaX: number;
  areaY: number;
  areaWidth: number;
  areaHeight: number;
  titleFontSize: number;
  nodes: TreeNode[];
  edges: [TreeNode, TreeNode][];
  getAdjustedPosition: (baseX: number, baseY: number, area: 'tree1' | 'tree2' | 'merged') => { x: number, y: number };
  areaType: 'tree1' | 'tree2' | 'merged';
  nodeStates: Map<string, { val: number, color: string, scale: number, opacity: number }> | undefined;
  edgesStates: Map<string, { stroke: string, width: number, opacity: number }> | undefined;
  getEdgeId: (source: TreeNode, target: TreeNode) => string;
  scaleFactor: number;
}

const TreeAreaComponent: React.FC<TreeAreaProps> = ({
  title,
  titleColor,
  areaColor,
  borderColor,
  areaX,
  areaY,
  areaWidth,
  areaHeight,
  titleFontSize,
  nodes,
  edges,
  getAdjustedPosition,
  areaType,
  nodeStates,
  edgesStates,
  getEdgeId,
  scaleFactor
}) => {
  // 从节点ID获取位置信息
  const getNodeCoordinates = (node: TreeNode) => {
    // 提取节点ID中的数字
    let nodeId = 0;
    if (node.id) {
      // 获取ID中的数字部分
      const match = node.id.match(/\d+/);
      if (match) {
        nodeId = parseInt(match[0], 10);
      }
    }

    // 根据ID计算基础坐标
    // 在合并树中处理ID合并情况
    if (areaType === 'merged' && node.id?.startsWith('merged')) {
      const xOffset = (nodeId % 10) * 100 - 300;
      const yOffset = Math.floor(nodeId / 10) * 80;
      return { baseX: xOffset, baseY: yOffset };
    }
    
    // 普通树1和树2的布局
    const xSpread = areaType === 'tree1' ? 120 : 140;
    const xOffset = ((nodeId % 10) - 1) * xSpread;
    const yOffset = Math.floor(nodeId / 10) * 100;
    
    return { baseX: xOffset, baseY: yOffset };
  };
  
  return (
    <>
      {/* 区域背景 */}
      <rect 
        x={areaX} 
        y={areaY} 
        width={areaWidth} 
        height={areaHeight} 
        rx="10" 
        fill={areaColor} 
        stroke={borderColor} 
        strokeWidth="1" 
      />
      
      {/* 区域标题 */}
      <text 
        x={areaX + areaWidth / 2} 
        y={areaY - 20} 
        textAnchor="middle" 
        fontSize={titleFontSize} 
        fontWeight="bold" 
        fill={titleColor}
      >
        {title}
      </text>
      
      {/* 绘制边 */}
      {edges.map(([source, target]) => {
        const sourceCoords = getNodeCoordinates(source);
        const targetCoords = getNodeCoordinates(target);
        
        const sourcePos = getAdjustedPosition(
          sourceCoords.baseX,
          sourceCoords.baseY,
          areaType
        );
        const targetPos = getAdjustedPosition(
          targetCoords.baseX,
          targetCoords.baseY,
          areaType
        );
        
        return (
          <TreeEdgeComponent
            key={`edge-${areaType}-${getEdgeId(source, target)}`}
            sourcePosition={sourcePos}
            targetPosition={targetPos}
            stroke={borderColor}
            opacity={1}
            width={edgesStates?.get(`${source.id}-${target.id}`)?.width || 1.5}
          />
        );
      })}
      
      {/* 绘制节点 */}
      {nodes.map(node => {
        const nodeState = nodeStates?.get(node.id!);
        const coords = getNodeCoordinates(node);
        
        const position = getAdjustedPosition(
          coords.baseX,
          coords.baseY,
          areaType
        );
        
        return (
          <TreeNodeComponent
            key={`node-${areaType}-${node.id}`}
            node={node}
            position={position}
            color={nodeState?.color || titleColor}
            scale={(nodeState?.scale || 1) * scaleFactor * 0.9}
            opacity={nodeState?.opacity || 1}
            isHighlighted={nodeState?.scale === 1.2}
          />
        );
      })}
    </>
  );
};

export default TreeAreaComponent; 