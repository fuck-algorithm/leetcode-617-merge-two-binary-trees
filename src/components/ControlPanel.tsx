import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { nextStep, prevStep, setCurrentStep, resetSteps, setSteps } from '../store/features/treeSlice';
import { createMergeSteps } from '../utils/treeUtils';
import { RootState } from '../store';

const ControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { tree1, tree2, currentStep, totalSteps, steps } = useAppSelector((state: RootState) => state.tree);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // 默认1秒/步
  
  // 开始合并
  const startMerge = () => {
    if (!tree1 || !tree2) {
      alert('请先设置两棵树数据');
      return;
    }
    
    try {
      // 创建合并步骤
      const mergeSteps = createMergeSteps(tree1, tree2);
      
      // 设置步骤到Redux
      dispatch(setSteps(mergeSteps));
      dispatch(setCurrentStep(0));
    } catch (error) {
      console.error('生成合并步骤时出错:', error);
      alert(`生成步骤时出错: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // 重置
  const resetAnimation = () => {
    setIsPlaying(false);
    dispatch(resetSteps());
  };

  // 自动播放控制
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    
    if (isPlaying && currentStep < totalSteps - 1) {
      timer = setTimeout(() => {
        dispatch(nextStep());
      }, speed);
    } else if (currentStep >= totalSteps - 1) {
      setIsPlaying(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isPlaying, currentStep, totalSteps, speed, dispatch]);

  // 进度条处理
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const step = parseInt(e.target.value);
    dispatch(setCurrentStep(step));
  };

  return (
    <div className="control-panel">
      <div className="control-group algorithm-selector">
        <select 
          title="选择合并算法"
          className="algorithm-select"
          defaultValue="dfs"
        >
          <option value="dfs">DFS</option>
          <option value="bfs">BFS</option>
        </select>
      </div>
      
      <div className="control-group playback-controls">
        <button
          className="control-btn start-btn"
          onClick={startMerge}
          disabled={isPlaying || !tree1 || !tree2}
          title="开始合并"
        >
          合并
        </button>
        
        <button
          className="control-btn prev-btn"
          onClick={() => dispatch(prevStep())}
          disabled={currentStep === 0 || totalSteps === 0}
          title="上一步"
        >
          ◀
        </button>
        
        <button
          className="control-btn play-btn"
          onClick={() => setIsPlaying(!isPlaying)}
          disabled={totalSteps === 0 || currentStep >= totalSteps - 1}
          title={isPlaying ? "暂停" : "播放"}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        
        <button
          className="control-btn next-btn"
          onClick={() => dispatch(nextStep())}
          disabled={currentStep >= totalSteps - 1 || totalSteps === 0}
          title="下一步"
        >
          ▶
        </button>
        
        <button
          className="control-btn reset-btn"
          onClick={resetAnimation}
          disabled={totalSteps === 0}
          title="重置动画"
        >
          ↺
        </button>
      </div>
      
      <div className="control-group progress-container">
        <input
          type="range"
          min="0"
          max={totalSteps > 0 ? totalSteps - 1 : 0}
          value={currentStep}
          onChange={handleProgressChange}
          disabled={totalSteps === 0}
          className="progress-slider"
        />
        <div className="step-counter">
          {totalSteps > 0 ? `${currentStep + 1}/${totalSteps}` : '0/0'}
        </div>
      </div>
      
      <div className="control-group speed-control">
        <select
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="speed-select"
          title="调整播放速度"
        >
          <option value={2000}>0.5x</option>
          <option value={1000}>1.0x</option>
          <option value={500}>2.0x</option>
        </select>
      </div>
    </div>
  );
};

export default ControlPanel; 