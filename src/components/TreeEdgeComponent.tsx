import React from 'react';
import { NodePosition } from '../types';

interface TreeEdgeProps {
  sourcePosition: NodePosition;
  targetPosition: NodePosition;
  stroke?: string;
  width?: number;
  opacity?: number;
  dashed?: boolean;
}

const TreeEdgeComponent: React.FC<TreeEdgeProps> = ({
  sourcePosition,
  targetPosition,
  stroke = '#555',
  width = 1.5,
  opacity = 1,
  dashed = false
}) => {
  return (
    <line
      x1={sourcePosition.x}
      y1={sourcePosition.y}
      x2={targetPosition.x}
      y2={targetPosition.y}
      stroke={stroke}
      strokeWidth={width}
      strokeDasharray={dashed ? "5,5" : ""}
      style={{ opacity }}
    />
  );
};

export default TreeEdgeComponent; 