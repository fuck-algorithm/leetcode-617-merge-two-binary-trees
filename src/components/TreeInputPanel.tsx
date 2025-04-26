import React, { useState } from 'react';
import { useAppDispatch } from '../store/hooks';
import { setTreeData } from '../store/features/treeSlice';
import { parseTreeInput, generateRandomTree } from '../utils/treeUtils';

const TreeInputPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const [tree1Input, setTree1Input] = useState('[1,3,2,5]');
  const [tree2Input, setTree2Input] = useState('[2,1,3,null,4,null,7]');

  const applyTreeData = () => {
    try {
      const tree1Array = parseTreeInput(tree1Input);
      const tree2Array = parseTreeInput(tree2Input);
      
      dispatch(setTreeData({
        tree1: tree1Array,
        tree2: tree2Array
      }));
    } catch (error) {
      console.error('Invalid tree format:', error);
      alert('无效的树格式，请检查输入。格式应为: [1,2,3,null,5]');
    }
  };

  const generateRandomTrees = () => {
    const tree1Array = generateRandomTree(4);
    const tree2Array = generateRandomTree(4);
    
    setTree1Input(JSON.stringify(tree1Array));
    setTree2Input(JSON.stringify(tree2Array));
    
    dispatch(setTreeData({
      tree1: tree1Array,
      tree2: tree2Array
    }));
  };

  return (
    <div className="tree-input-panel">
      <h3 className="panel-title">二叉树数据设置</h3>
      
      <div className="input-field">
        <label htmlFor="tree1-input">树 1:</label>
        <input
          id="tree1-input"
          type="text"
          value={tree1Input}
          onChange={(e) => setTree1Input(e.target.value)}
          className="tree-input"
          placeholder="例如: [1,3,2,5]"
        />
      </div>
      
      <div className="input-field">
        <label htmlFor="tree2-input">树 2:</label>
        <input
          id="tree2-input"
          type="text"
          value={tree2Input}
          onChange={(e) => setTree2Input(e.target.value)}
          className="tree-input"
          placeholder="例如: [2,1,3,null,4,null,7]"
        />
      </div>
      
      <div className="tree-actions">
        <button
          onClick={applyTreeData}
          className="tree-btn apply-btn"
        >
          应用数据
        </button>
        
        <button
          onClick={generateRandomTrees}
          className="tree-btn random-btn"
        >
          随机生成
        </button>
      </div>
      
      <div className="input-guide">
        <p>输入格式: 使用数组表示树，例如 [1,2,3,null,5]</p>
        <p>null 表示节点不存在</p>
      </div>
    </div>
  );
};

export default TreeInputPanel; 