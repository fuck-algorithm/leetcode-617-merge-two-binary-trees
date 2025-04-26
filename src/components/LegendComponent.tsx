import React from 'react';

interface LegendComponentProps {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  scaleFactor: number;
  isSmallScreen: boolean;
}

const LegendComponent: React.FC<LegendComponentProps> = ({ 
  x, 
  y, 
  width, 
  height, 
  fontSize, 
  scaleFactor,
  isSmallScreen
}) => {
  return (
    <g transform={`translate(0, ${isSmallScreen ? 8 : 0})`}>
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        rx="5" 
        fill="rgba(255,255,255,0.9)" 
        stroke="#ccc" 
      />
      
      {/* 树1节点 */}
      <circle 
        cx={x + width * 0.15} 
        cy={y + height / 2} 
        r={8 * scaleFactor} 
        fill="#fff" 
        stroke="#2196f3" 
        strokeWidth={2 * scaleFactor} 
      />
      <text 
        x={x + width * 0.2} 
        y={y + height / 2} 
        dominantBaseline="middle"
        fontSize={fontSize}
      >
        第一棵树节点
      </text>
      
      {/* 树2节点 */}
      <circle 
        cx={x + width * 0.45} 
        cy={y + height / 2} 
        r={8 * scaleFactor} 
        fill="#fff" 
        stroke="#ff9800" 
        strokeWidth={2 * scaleFactor} 
      />
      <text 
        x={x + width * 0.5} 
        y={y + height / 2} 
        dominantBaseline="middle"
        fontSize={fontSize}
      >
        第二棵树节点
      </text>
      
      {/* 合并树节点 */}
      <circle 
        cx={x + width * 0.75} 
        cy={y + height / 2} 
        r={8 * scaleFactor} 
        fill="#fff" 
        stroke="#4caf50" 
        strokeWidth={2 * scaleFactor} 
      />
      <text 
        x={x + width * 0.8} 
        y={y + height / 2} 
        dominantBaseline="middle"
        fontSize={fontSize}
      >
        合并后节点
      </text>
    </g>
  );
};

export default LegendComponent; 