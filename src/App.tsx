import { useCallback, useRef, useState } from 'react'
import type { Node } from '@xyflow/react'
import { TopBar } from '@/components/layout/TopBar'
import { LeftRail } from '@/components/layout/LeftRail'
import { RightPanel } from '@/components/layout/RightPanel'
import { AppCanvas } from '@/components/canvas/AppCanvas'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useAppStore } from '@/store/useAppStore'
import { useGraph } from '@/hooks/useGraph'
import type { ServiceNodeData } from '@/types'

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const fitViewRef = useRef<() => void>(() => {})
  const [canvasNodes, setCanvasNodes] = useState<Node[]>([])
  const { selectedAppId, isMobilePanelOpen, setMobilePanelOpen } = useAppStore()
  const { isLoading: isLoadingGraph, isError: isErrorGraph } = useGraph(selectedAppId)

  // Keep a mutable ref to the node updater from canvas
  const updateNodeRef = useRef<(id: string, patch: Partial<ServiceNodeData>) => void>(
    () => {},
  )

  const handleFitViewReady = useCallback((fn: () => void) => {
    fitViewRef.current = fn
  }, [])

  const handleNodesChange = useCallback((nodes: Node[]) => {
    setCanvasNodes(nodes)
  }, [])

  function handleUpdateNode(id: string, patch: Partial<ServiceNodeData>) {
    updateNodeRef.current(id, patch)
    // Also update local canvas nodes for inspector sync
    setCanvasNodes((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, data: { ...n.data, ...patch } } : n,
      ),
    )
  }

  function toggleDark() {
    setIsDark((v) => {
      document.documentElement.classList.toggle('dark', !v)
      return !v
    })
  }

  const rightPanelContent = (
    <RightPanel
      nodes={canvasNodes}
      onUpdateNode={handleUpdateNode}
      isLoadingGraph={isLoadingGraph}
      isErrorGraph={isErrorGraph}
    />
  )

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
        <TopBar
          onFitView={() => fitViewRef.current?.()}
          isDark={isDark}
          onToggleDark={toggleDark}
        />

        <div className="flex flex-1 overflow-hidden">
          <LeftRail />

          {/* Canvas */}
          <AppCanvas
            onFitViewReady={handleFitViewReady}
            onNodesChange={handleNodesChange}
          />

          {/* Right panel — desktop */}
          <div className="hidden md:flex">
            {rightPanelContent}
          </div>

          {/* Right panel — mobile sheet */}
          <Sheet open={isMobilePanelOpen} onOpenChange={setMobilePanelOpen}>
            <SheetContent side="right" className="p-0 w-80">
              <SheetHeader className="sr-only">
                <SheetTitle>Inspector Panel</SheetTitle>
              </SheetHeader>
              {rightPanelContent}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
