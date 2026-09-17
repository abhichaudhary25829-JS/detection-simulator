import { useMemo } from 'react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import Header from '../components/Header';
import Card from '../components/Card';
import { useAppState } from '../utils/AppContext';

// Builds React Flow nodes/edges dynamically from the current
// Allocation and Need (i.e. outstanding request) matrices.
function buildGraph(numProcesses, numResources, allocation, needMatrix) {
  const nodes = [];
  const edges = [];

  const processSpacingY = 100;
  const resourceSpacingY = 100;
  const processX = 120;
  const resourceX = 520;

  for (let i = 0; i < numProcesses; i++) {
    nodes.push({
      id: `P${i}`,
      position: { x: processX, y: i * processSpacingY + 40 },
      data: { label: `Process P${i}` },
      style: {
        background: '#1e3a5f',
        color: '#e6f0ff',
        border: '2px solid #4f9dff',
        borderRadius: '50%',
        width: 90,
        height: 90,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: 13,
      },
    });
  }

  for (let j = 0; j < numResources; j++) {
    nodes.push({
      id: `R${j}`,
      position: { x: resourceX, y: j * resourceSpacingY + 40 },
      data: { label: `Resource R${j}` },
      style: {
        background: '#3d2b1f',
        color: '#ffe6cc',
        border: '2px solid #ff9d4f',
        borderRadius: 8,
        width: 100,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        fontSize: 12,
      },
    });
  }

  // Allocation edges: Resource -> Process (resource is currently held by process)
  for (let i = 0; i < numProcesses; i++) {
    for (let j = 0; j < numResources; j++) {
      if (allocation[i][j] > 0) {
        edges.push({
          id: `alloc-R${j}-P${i}`,
          source: `R${j}`,
          target: `P${i}`,
          label: `alloc: ${allocation[i][j]}`,
          style: { stroke: '#4fdc8e' },
          labelStyle: { fill: '#4fdc8e', fontSize: 11 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#4fdc8e' },
          animated: false,
        });
      }
    }
  }

  // Request edges: Process -> Resource (process still needs this resource)
  for (let i = 0; i < numProcesses; i++) {
    for (let j = 0; j < numResources; j++) {
      if (needMatrix[i][j] > 0) {
        edges.push({
          id: `req-P${i}-R${j}`,
          source: `P${i}`,
          target: `R${j}`,
          label: `req: ${needMatrix[i][j]}`,
          style: { stroke: '#ff6b6b', strokeDasharray: '5,5' },
          labelStyle: { fill: '#ff6b6b', fontSize: 11 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#ff6b6b' },
          animated: false,
        });
      }
    }
  }

  return { nodes, edges };
}

export default function ResourceGraph() {
  const { numProcesses, numResources, allocation, maximum } = useAppState();

  const needMatrix = useMemo(
    () => maximum.map((row, i) => row.map((max, j) => Number(max) - Number(allocation[i][j]))),
    [allocation, maximum]
  );

  const { nodes, edges } = useMemo(
    () => buildGraph(numProcesses, numResources, allocation, needMatrix),
    [numProcesses, numResources, allocation, needMatrix]
  );

  return (
    <div>
      <Header
        title="Resource Allocation Graph"
        subtitle="Green solid edges = Allocation (Resource → Process). Red dashed edges = outstanding Request/Need (Process → Resource). Data reflects the Banker's Algorithm page."
      />
      <Card>
        <div style={{ height: '600px', background: '#0f1620', borderRadius: '8px' }}>
          <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
            <Background color="#2a3a4f" gap={20} />
            <Controls />
          </ReactFlow>
        </div>
      </Card>
      <Card title="Legend">
        <div className="legend-row">
          <span className="legend-item"><span className="legend-swatch process-swatch" /> Process node</span>
          <span className="legend-item"><span className="legend-swatch resource-swatch" /> Resource node</span>
          <span className="legend-item"><span className="legend-swatch alloc-swatch" /> Allocation edge (held)</span>
          <span className="legend-item"><span className="legend-swatch req-swatch" /> Request edge (waiting)</span>
        </div>
      </Card>
    </div>
  );
}
