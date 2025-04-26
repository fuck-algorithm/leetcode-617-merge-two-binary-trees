import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import D3CanvasComponent from './components/D3CanvasComponent';
import TreeInputPanel from './components/TreeInputPanel';
import ControlPanelComponent from './components/ControlPanelComponent';

// 简单的描述提示组件
const DescriptionTooltip: React.FC = () => {
  return (
    <div className="description-tooltip">
      <div className="description-content">
        算法动画可视化
      </div>
    </div>
  );
};

// 工具面板组件，可折叠
const ToolPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className={`tool-panel ${isOpen ? 'open' : 'closed'}`}>
      <button 
        className="tool-toggle" 
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "关闭工具面板" : "打开工具面板"}
      >
        {isOpen ? '×' : '⚙'}
      </button>
      
      {isOpen && (
        <div className="tool-content">
          <TreeInputPanel />
        </div>
      )}
    </div>
  );
};

// 主内容区域组件
const AppContent: React.FC = () => {
  return (
    <div className="app-container">
      {/* 主画布区域 - 占据主要空间 */}
      <div className="canvas-container">
        <D3CanvasComponent />
        <DescriptionTooltip />
      </div>
      
      {/* 控制面板 - 紧贴底部 */}
      <div className="control-container">
        <ControlPanelComponent />
      </div>
      
      {/* 工具面板 - 侧边可折叠 */}
      <ToolPanel />
    </div>
  );
};

// 主应用组件
function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
