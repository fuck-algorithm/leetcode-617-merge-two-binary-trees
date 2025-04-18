import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  playAnimation, 
  pauseAnimation, 
  setSpeed, 
  nextStep, 
  prevStep, 
  setCurrentStep,
  setAlgorithm,
  resetAnimation
} from '../store/animationSlice';
import { RootState } from '../store';

const ControlPanelComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { animation, steps } = useAppSelector((state: RootState) => ({
    animation: state.animation.animation,
    steps: state.animation.animation.algorithm === 'DFS' 
      ? state.animation.dfsSteps 
      : state.animation.bfsSteps
  }));
  
  const [intervalId, setIntervalId] = useState<number | null>(null);
  
  // 动画播放控制
  useEffect(() => {
    if (animation.isPlaying) {
      // 清除旧的定时器
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // 设置新的定时器
      const id = window.setInterval(() => {
        dispatch(nextStep());
      }, 1000 / animation.speed);
      
      setIntervalId(id);
      
      // 当所有步骤执行完后，停止播放
      if (animation.currentStep >= steps.length - 1) {
        dispatch(pauseAnimation());
      }
    } else if (intervalId) {
      // 暂停时清除定时器
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    // 清理函数
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [animation.isPlaying, animation.speed, animation.currentStep, steps.length, dispatch, intervalId]);
  
  // 播放/暂停处理
  const handlePlayPause = () => {
    if (animation.isPlaying) {
      dispatch(pauseAnimation());
    } else {
      // 如果已经到最后一步，则重新开始
      if (animation.currentStep >= steps.length - 1) {
        dispatch(resetAnimation());
      }
      dispatch(playAnimation());
    }
  };
  
  // 下一步/上一步处理
  const handleNext = () => {
    dispatch(nextStep());
  };
  
  const handlePrev = () => {
    dispatch(prevStep());
  };
  
  // 算法切换处理
  const handleAlgorithmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setAlgorithm(e.target.value as 'DFS' | 'BFS'));
  };
  
  // 速度调整处理
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSpeed(parseFloat(e.target.value)));
  };
  
  // 进度条处理
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentStep(parseInt(e.target.value, 10)));
  };
  
  return (
    <div className="control-panel" style={{ padding: '16px', borderTop: '1px solid #eee' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <select 
            value={animation.algorithm} 
            onChange={handleAlgorithmChange}
            style={{ padding: '8px', borderRadius: '4px', marginRight: '10px' }}
          >
            <option value="DFS">深度优先搜索 (DFS)</option>
            <option value="BFS">广度优先搜索 (BFS)</option>
          </select>
          
          <button 
            onClick={handlePlayPause}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px', 
              backgroundColor: animation.isPlaying ? '#f44336' : '#4caf50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            {animation.isPlaying ? '暂停' : '播放'}
          </button>
          
          <button 
            onClick={handlePrev}
            disabled={animation.currentStep <= 0}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: animation.currentStep <= 0 ? '#f5f5f5' : 'white',
              cursor: animation.currentStep <= 0 ? 'not-allowed' : 'pointer',
              marginRight: '10px'
            }}
          >
            上一步
          </button>
          
          <button 
            onClick={handleNext}
            disabled={animation.currentStep >= steps.length - 1}
            style={{ 
              padding: '8px 16px', 
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: animation.currentStep >= steps.length - 1 ? '#f5f5f5' : 'white',
              cursor: animation.currentStep >= steps.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            下一步
          </button>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '8px' }}>速度:</span>
          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={animation.speed}
            onChange={handleSpeedChange}
            style={{ width: '100px' }}
          />
          <span style={{ marginLeft: '8px', minWidth: '30px' }}>{animation.speed.toFixed(1)}x</span>
        </div>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '8px', minWidth: '40px' }}>
          {animation.currentStep}/{steps.length - 1}
        </span>
        <input
          type="range"
          min="0"
          max={steps.length - 1}
          value={animation.currentStep}
          onChange={handleProgressChange}
          style={{ flex: 1 }}
        />
      </div>
      
      {steps[animation.currentStep] && (
        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#f5f5f5', 
          borderRadius: '4px',
          color: '#333'
        }}>
          <p style={{ margin: 0 }}>{steps[animation.currentStep].description}</p>
        </div>
      )}
    </div>
  );
};

export default ControlPanelComponent; 