import React from 'react';

interface MessageComponentProps {
  message: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
}

const MessageComponent: React.FC<MessageComponentProps> = ({ 
  message, 
  x, 
  y, 
  width, 
  height, 
  fontSize 
}) => {
  if (!message) return null;
  
  return (
    <g>
      <rect 
        x={x} 
        y={y} 
        width={width} 
        height={height} 
        rx="8" 
        ry="8" 
        fill="rgba(0,0,0,0.7)" 
      />
      <text
        x={x + width / 2}
        y={y + height / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="bold"
        fill="#ffffff"
      >
        {message}
      </text>
    </g>
  );
};

export default MessageComponent; 