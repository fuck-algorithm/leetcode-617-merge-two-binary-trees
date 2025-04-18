import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import D3CanvasComponent from './components/D3CanvasComponent';
import ControlPanelComponent from './components/ControlPanelComponent';
import { setAlgorithm, setCurrentStep } from './store/animationSlice';

function App() {
  useEffect(() => {
    // 初始化动画状态
    store.dispatch(setAlgorithm('DFS'));
    store.dispatch(setCurrentStep(0));
  }, []);

  return (
    <Provider store={store}>
      <div className="app-container" style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <header style={{ marginBottom: '20px' }}>
          <h1 style={{ margin: 0, color: '#333', textAlign: 'center' }}>
            合并二叉树算法可视化
          </h1>
          <p style={{ 
            textAlign: 'center', 
            color: '#666', 
            margin: '10px 0 0 0',
            fontSize: '16px'
          }}>
            LeetCode 617: 将两棵二叉树合并为一棵新二叉树
          </p>
        </header>
        
        <div style={{ 
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}>
          <div className="canvas-container" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <D3CanvasComponent />
          </div>
          
          <ControlPanelComponent />
        </div>
        
        <footer style={{ marginTop: '20px', textAlign: 'center', color: '#888', fontSize: '14px' }}>
          <p>© {new Date().getFullYear()} 合并二叉树算法可视化演示</p>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
