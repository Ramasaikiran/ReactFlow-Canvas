import { ChevronRight, Search, Plus } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/useAppStore'
import { useApps } from '@/hooks/useApps'
import { NodeInspector } from '@/components/inspector/NodeInspector'
import type { ServiceNodeData } from '@/types'
import type { Node } from '@xyflow/react'

interface RightPanelProps {
  nodes: Node[]
  onUpdateNode: (id: string, patch: Partial<ServiceNodeData>) => void
  isLoadingGraph: boolean
  isErrorGraph: boolean
}

export function RightPanel({
  nodes,
  onUpdateNode,
  isLoadingGraph,
  isErrorGraph,
}: RightPanelProps) {
  const { selectedAppId, setSelectedAppId, selectedNodeId } = useAppStore()
  const { data: apps, isLoading: isLoadingApps, isError: isErrorApps } = useApps()

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)
  const selectedNodeData = selectedNode?.data as ServiceNodeData | undefined

  function handleUpdateNodeData(patch: Partial<ServiceNodeData>) {
    if (selectedNodeId) {
      onUpdateNode(selectedNodeId, patch)
    }
  }

  return (
    <div className="flex h-full w-72 flex-col border-l border-border/50 bg-card/80 backdrop-blur-sm flex-shrink-0">
      {/* Apps section */}
      <div className="border-b border-border/50">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Application
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 px-3 pb-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search..."
              className="w-full rounded-md border border-border/50 bg-muted/30 py-1.5 pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <button className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors">
            <Plus className="h-3.5 w-3.5 text-white" />
          </button>
        </div>

        {/* App list */}
        <div className="max-h-48 overflow-y-auto">
          {isErrorApps && (
            <div className="px-3 pb-3 text-xs text-red-400">Failed to load apps.</div>
          )}
          {isLoadingApps
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2">
                  <Skeleton className="h-6 w-6 rounded-md" />
                  <Skeleton className="h-4 w-36" />
                </div>
              ))
            : apps?.map((app) => (
                <button
                  key={app.id}
                  onClick={() => setSelectedAppId(app.id)}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/40 ${
                    selectedAppId === app.id ? 'bg-muted/50' : ''
                  }`}
                >
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-md text-sm"
                    style={{ backgroundColor: `${app.color}22` }}
                  >
                    {app.emoji}
                  </span>
                  <span
                    className={`flex-1 truncate text-xs ${
                      selectedAppId === app.id ? 'text-foreground font-medium' : 'text-muted-foreground'
                    }`}
                  >
                    {app.name}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
                </button>
              ))}
        </div>
      </div>

      {/* Node inspector section */}
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Node Inspector
          </span>
          {selectedNodeId && (
            <span className="text-xs text-muted-foreground/60 font-mono truncate">
              #{selectedNodeId}
            </span>
          )}
        </div>

        {isErrorGraph && (
          <div className="p-4 text-xs text-red-400 text-center">
            Failed to load graph data.
          </div>
        )}

        <NodeInspector
          nodeData={selectedNodeData ?? null}
          onUpdateNodeData={handleUpdateNodeData}
          isLoading={isLoadingGraph}
        />
      </div>
    </div>
  )
}
