import React from 'react';
import { TreeNode, NodePosition } from '../types';

interface TreeNodeProps {
  node: TreeNode;
  position: NodePosition;
  color?: string;
  scale?: number;
  opacity?: number;
  isHighlighted?: boolean;
}

const TreeNodeComponent: React.FC<TreeNodeProps> = ({ 
  node, 
  position, 
  color = '#333', 
  scale = 1,
  opacity = 1,
  isHighlighted = false
}) => {
  const nodeRadius = 25 * scale;
  
  return (
    <g 
      transform={`translate(${position.x}, ${position.y})`}
      style={{ opacity }}
    >
      {/* 高亮光晕效果 */}
      {isHighlighted && (
        <circle
          r={nodeRadius + 5}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeOpacity={0.5}
          strokeDasharray="5,3"
        >
          <animate 
            attributeName="r" 
            from={nodeRadius + 3} 
            to={nodeRadius + 8} 
            dur="1s" 
            repeatCount="indefinite" 
          />
        </circle>
      )}
      
      {/* 节点圆形背景 */}
      <circle
        r={nodeRadius}
        fill={isHighlighted ? `${color}20` : "#fff"}
        stroke={color}
        strokeWidth={isHighlighted ? 3 : 2}
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