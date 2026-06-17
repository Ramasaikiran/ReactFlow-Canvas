import { useCallback, useEffect, useMemo, useRef } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type Edge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ServiceNode } from './ServiceNode'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/useAppStore'
import { useGraph } from '@/hooks/useGraph'
import type { ServiceNodeData } from '@/types'

const nodeTypes = { service: ServiceNode }

interface AppCanvasProps {
  onFitViewReady: (fn: () => void) => void
  onNodesChange: (nodes: Node[]) => void
}

export function AppCanvas({ onFitViewReady, onNodesChange }: AppCanvasProps) {
  const { selectedAppId, selectedNodeId, setSelectedNodeId } = useAppStore()
  const { data: graph, isLoading, isError } = useGraph(selectedAppId)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rfInstance = useRef<any>(null)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodes, setNodes, handleNodesChange] = useNodesState<any>([])
  const [edges, setEdges, handleEdgesChange] = useEdgesState<Edge>([])

  useEffect(() => {
    if (graph) {
      setNodes(graph.nodes)
      setEdges(graph.edges)
      setTimeout(() => rfInstance.current?.fitView({ padding: 0.15 }), 100)
    }
  }, [graph, setNodes, setEdges])

  useEffect(() => {
    onNodesChange(nodes)
  }, [nodes, onNodesChange])

  useEffect(() => {
    onFitViewReady(() => {
      rfInstance.current?.fitView({ padding: 0.15, duration: 400 })
    })
  }, [onFitViewReady])

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges],
  )

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id)
    },
    [setSelectedNodeId],
  )

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [setSelectedNodeId])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        setNodes((ns: Node[]) => ns.filter((n) => n.id !== selectedNodeId))
        setEdges((es: Edge[]) =>
          es.filter(
            (edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId,
          ),
        )
        setSelectedNodeId(null)
      }
    },
    [selectedNodeId, setNodes, setEdges, setSelectedNodeId],
  )

  const styledNodes = useMemo(
    () =>
      nodes.map((n: Node) => ({
        ...n,
        selected: n.id === selectedNodeId,
      })),
    [nodes, selectedNodeId],
  )

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center gap-4 bg-background">
        <div className="space-y-3 w-72">
          <Skeleton className="h-40 w-full rounded-xl" />
          <div className="flex gap-4">
            <Skeleton className="h-40 flex-1 rounded-xl" />
            <Skeleton className="h-40 flex-1 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400 text-sm gap-2">
        <span>⚠</span>
        <span>Failed to load graph. Toggle the error button to retry.</span>
      </div>
    )
  }

  return (
    <div
      className="flex-1 relative"
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{ outline: 'none' }}
    >
      <ReactFlow
        nodes={styledNodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        onInit={(instance) => {
          rfInstance.current = instance
          onFitViewReady(() => instance.fitView({ padding: 0.15, duration: 400 }))
        }}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        deleteKeyCode={null}
        className="bg-transparent"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1.5}
          color="rgba(148,163,184,0.12)"
        />
        <Controls
          className="!bottom-4 !left-4 !top-auto"
          showInteractive={false}
        />
        <MiniMap
          className="!bottom-4 !right-4 !top-auto opacity-40 hover:opacity-80 transition-opacity"
          nodeColor={(n) => {
            const d = n.data as ServiceNodeData
            if (d?.status === 'Healthy') return '#22c55e'
            if (d?.status === 'Degraded') return '#f59e0b'
            return '#ef4444'
          }}
          maskColor="rgba(0,0,0,0.7)"
          style={{ background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(148,163,184,0.1)' }}
        />
      </ReactFlow>
    </div>
  )
}
