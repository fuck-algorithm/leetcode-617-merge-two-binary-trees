import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  nextStep, 
  prevStep, 
  setCurrentStep,
  resetSteps
} from '../store/features/treeSlice';
import { RootState } from '../store';

const ControlPanelComponent: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentStep, totalSteps, steps } = useAppSelector((state: RootState) => state.tree);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [algorithm, setAlgorithmState] = useState<'DFS' | 'BFS'>('DFS');
  
  const [intervalId, setIntervalId] = useState<number | null>(null);
  
  // 动画播放控制
  useEffect(() => {
    if (isPlaying && currentStep < totalSteps - 1) {
      // 清除旧的定时器
      if (intervalId) {
        clearInterval(intervalId);
      }
      
      // 设置新的定时器
      const id = window.setInterval(() => {
        dispatch(nextStep());
      }, 1000 / speed);
      
      setIntervalId(id);
      
      // 当所有步骤执行完后，停止播放
      if (currentStep >= totalSteps - 1) {
        setIsPlaying(false);
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
  }, [isPlaying, speed, currentStep, totalSteps, dispatch, intervalId]);
  
  // 播放/暂停处理
  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      // 如果已经到最后一步，则重新开始
      if (currentStep >= totalSteps - 1) {
        dispatch(setCurrentStep(0));
      }
      setIsPlaying(true);
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
    setAlgorithmState(e.target.value as 'DFS' | 'BFS');
  };
  
  // 速度调整处理
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSpeed(parseFloat(e.target.value));
  };
  
  // 进度条处理
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setCurrentStep(parseInt(e.target.value, 10)));
  };
  
  // 重置动画
  const handleReset = () => {
    setIsPlaying(false);
    dispatch(resetSteps());
  };
  
  return (
    <div className="control-panel">
      {/* 左侧控制区域 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '8px',
      }}>
        {/* 算法选择 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          minWidth: '70px'
        }}>
          <select 
            value={algorithm} 
            onChange={handleAlgorithmChange}
            style={{ 
              padding: '4px 6px', 
              borderRadius: '4px', 
              border: '1px solid #ccc',
              fontSize: '13px',
              width: '100%'
            }}
          >
            <option value="DFS">DFS</option>
            <option value="BFS">BFS</option>
          </select>
        </div>
        
        {/* 播放控制按钮组 */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px'
        }}>
          <button 
            onClick={handlePrev}
            disabled={currentStep <= 0}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: currentStep <= 0 ? '#f5f5f5' : 'white',
              cursor: currentStep <= 0 ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            ◀
          </button>
          
          <button 
            onClick={handlePlayPause}
            style={{ 
              padding: '4px 10px', 
              borderRadius: '4px', 
              backgroundColor: isPlaying ? '#f44336' : '#4caf50',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>
          
          <button 
            onClick={handleNext}
            disabled={currentStep >= totalSteps - 1}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: currentStep >= totalSteps - 1 ? '#f5f5f5' : 'white',
              cursor: currentStep >= totalSteps - 1 ? 'not-allowed' : 'pointer',
              fontSize: '12px'
            }}
          >
            ▶
          </button>
          
          <button 
            onClick={handleReset}
            style={{ 
              padding: '4px 8px', 
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            ↻
          </button>
        </div>
      </div>

      {/* 中间进度区域 */}
      <div className="progress-container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '4px'
        }}>
          <span style={{ fontSize: '13px' }}>
            {currentStep + 1}/{totalSteps}
          </span>
          <input
            type="range"
            min="0"
            max={totalSteps - 1 > 0 ? totalSteps - 1 : 0}
            value={currentStep}
            onChange={handleProgressChange}
            style={{ 
              flex: '1',
              minWidth: '100px',
              height: '6px',
              margin: '0 10px'
            }}
          />
        </div>
        
        {/* 步骤描述部分 */}
        {steps && steps[currentStep] && (
          <div className="step-description">
            <span style={{ fontWeight: 'bold', marginRight: '6px' }}>
              步骤 {currentStep + 1}:
            </span>
            {steps[currentStep].description}
          </div>
        )}
      </div>
      
      {/* 右侧速度控制 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: '4px',
        fontSize: '13px',
        minWidth: '100px'
      }}>
        <span>速度:</span>
        <input
          type="range"
          min="0.5"
          max="3"
          step="0.5"
          value={speed}
          onChange={handleSpeedChange}
          style={{ width: '60px', height: '6px' }}
        />
        <span style={{ minWidth: '24px' }}>{speed.toFixed(1)}x</span>
      </div>
    </div>
  );
};

export default ControlPanelComponent; 