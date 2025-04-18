import React, { useRef } from 'react';
import { useAppSelector } from '../store/hooks';
import TreeNodeComponent from './TreeNodeComponent';
import TreeEdgeComponent from './TreeEdgeComponent';
import { TreeNode } from '../types';
import { RootState } from '../store';

const D3CanvasComponent: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { treeData, currentSnapshot } = useAppSelector((state: RootState) => ({
    treeData: state.animation.treeData,
    currentSnapshot: state.animation.currentSnapshot
  }));
  
  // 创建边的ID
  const getEdgeId = (source: TreeNode, target: TreeNode): string => {
    return `${source.id}-${target.id}`;
  };
  
  // 计算树的所有边
  const calculateEdges = (root: TreeNode | null, edges: [TreeNode, TreeNode][] = []): [TreeNode, TreeNode][] => {
    if (!root) return edges;
    
    if (root.left) {
      edges.push([root, root.left]);
      calculateEdges(root.left, edges);
    }
    
    if (root.right) {
      edges.push([root, root.right]);
      calculateEdges(root.right, edges);
    }
    
    return edges;
  };
  
  // 收集所有树节点
  const collectNodes = (root: TreeNode | null, nodes: TreeNode[] = []): TreeNode[] => {
    if (!root) return nodes;
    
    nodes.push(root);
    collectNodes(root.left, nodes);
    collectNodes(root.right, nodes);
    
    return nodes;
  };
  
  // 准备渲染数据
  const edges1 = calculateEdges(treeData.root1);
  const edges2 = calculateEdges(treeData.root2);
  const edgesMerged = calculateEdges(treeData.mergedRoot);
  
  const nodes1 = collectNodes(treeData.root1);
  const nodes2 = collectNodes(treeData.root2);
  const nodesMerged = collectNodes(treeData.mergedRoot);
  
  return (
    <svg ref={svgRef} width="100%" height="100%" viewBox="0 0 800 500" style={{ maxHeight: 'calc(100vh - 200px)' }}>
      {/* 背景 */}
      <rect width="100%" height="100%" fill="#f9f9f9" />
      
      {/* 绘制树1的边 */}
      {edges1.map(([source, target]) => (
        <TreeEdgeComponent
          key={`edge1-${getEdgeId(source, target)}`}
          sourcePosition={treeData.nodePositions.get(source.id!) || { x: 0, y: 0 }}
          targetPosition={treeData.nodePositions.get(target.id!) || { x: 0, y: 0 }}
          stroke="#2196f3"
          opacity={currentSnapshot?.edgesState?.get(`${source.id}-${target.id}`)?.opacity || 1}
          width={currentSnapshot?.edgesState?.get(`${source.id}-${target.id}`)?.width || 1.5}
        />
      ))}
      
      {/* 绘制树2的边 */}
      {edges2.map(([source, target]) => (
        <TreeEdgeComponent
          key={`edge2-${getEdgeId(source, target)}`}
          sourcePosition={treeData.nodePositions.get(source.id!) || { x: 0, y: 0 }}
          targetPosition={treeData.nodePositions.get(target.id!) || { x: 0, y: 0 }}
          stroke="#ff9800"
          opacity={currentSnapshot?.edgesState?.get(`${source.id}-${target.id}`)?.opacity || 1}
          width={currentSnapshot?.edgesState?.get(`${source.id}-${target.id}`)?.width || 1.5}
        />
      ))}
      
      {/* 绘制合并树的边 */}
      {edgesMerged.map(([source, target]) => (
        <TreeEdgeComponent
          key={`edge-merged-${getEdgeId(source, target)}`}
          sourcePosition={treeData.nodePositions.get(source.id!) || { x: 0, y: 0 }}
          targetPosition={treeData.nodePositions.get(target.id!) || { x: 0, y: 0 }}
          stroke="#4caf50"
          opacity={currentSnapshot?.edgesState?.get(`${source.id}-${target.id}`)?.opacity || 1}
          width={currentSnapshot?.edgesState?.get(`${source.id}-${target.id}`)?.width || 1.5}
        />
      ))}
      
      {/* 绘制树1的节点 */}
      {nodes1.map(node => {
        const nodeState = currentSnapshot?.nodesState?.get(node.id!);
        return (
          <TreeNodeComponent
            key={`node1-${node.id}`}
            node={node}
            position={treeData.nodePositions.get(node.id!) || { x: 0, y: 0 }}
            color={nodeState?.color || "#2196f3"}
            scale={nodeState?.scale || 1}
            opacity={nodeState?.opacity || 1}
          />
        );
      })}
      
      {/* 绘制树2的节点 */}
      {nodes2.map(node => {
        const nodeState = currentSnapshot?.nodesState?.get(node.id!);
        return (
          <TreeNodeComponent
            key={`node2-${node.id}`}
            node={node}
            position={treeData.nodePositions.get(node.id!) || { x: 0, y: 0 }}
            color={nodeState?.color || "#ff9800"}
            scale={nodeState?.scale || 1}
            opacity={nodeState?.opacity || 1}
          />
        );
      })}
      
      {/* 绘制合并树的节点 */}
      {nodesMerged.map(node => {
        const nodeState = currentSnapshot?.nodesState?.get(node.id!);
        return (
          <TreeNodeComponent
            key={`node-merged-${node.id}`}
            node={node}
            position={treeData.nodePositions.get(node.id!) || { x: 0, y: 0 }}
            color={nodeState?.color || "#4caf50"}
            scale={nodeState?.scale || 1}
            opacity={nodeState?.opacity || 1}
          />
        );
      })}
      
      {/* 显示当前步骤信息 */}
      {currentSnapshot && (
        <text
          x="400"
          y="30"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="#333"
        >
          {currentSnapshot.message}
        </text>
      )}
    </svg>
  );
};

export default D3CanvasComponent; 