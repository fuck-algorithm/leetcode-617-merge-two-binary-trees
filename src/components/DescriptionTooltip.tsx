import React from 'react';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';

const DescriptionTooltip: React.FC = () => {
  const { currentStep, steps } = useAppSelector((state: RootState) => state.tree);
  
  // 如果没有步骤或当前步骤不存在，不显示任何内容
  if (!steps || !steps[currentStep]) {
    return null;
  }
  
  return (
    <div className="description-tooltip">
      <div className="description-content">
        {steps[currentStep].description}
      </div>
    </div>
  );
};

export default DescriptionTooltip; 