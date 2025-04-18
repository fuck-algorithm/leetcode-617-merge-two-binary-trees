import React from 'react';
import { TreeNode, NodePosition } from '../types';

interface TreeNodeProps {
  node: TreeNode;
  position: NodePosition;
  color?: string;
  scale?: number;
  opacity?: number;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ 
  node, 
  position, 
  color = '#333', 
  scale = 1,
  opacity = 1
}) => {
  const nodeRadius = 25 * scale;
  
  return (
    <g 
      transform={`translate(${position.x}, ${position.y})`}
      style={{ opacity }}
    >
      {/* 节点圆形背景 */}
      <circle
        r={nodeRadius}
        fill="#fff"
        stroke={color}
        strokeWidth={2}
      />
      
      {/* 节点值 */}
      <text
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={14 * scale}
        fontWeight="bold"
        fill={color}
      >
        {node.val}
      </text>
    </g>
  );
};

export default TreeNodeComponent; 