import { memo, useCallback } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Settings, CheckCircle2, AlertTriangle, Cpu, MemoryStick, HardDrive, Globe } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { useAppStore } from '@/store/useAppStore'
import type { ServiceNodeData, ResourceTab } from '@/types'

const TABS: { key: ResourceTab; icon: React.ReactNode }[] = [
  { key: 'CPU', icon: <Cpu className="h-3 w-3" /> },
  { key: 'Memory', icon: <MemoryStick className="h-3 w-3" /> },
  { key: 'Disk', icon: <HardDrive className="h-3 w-3" /> },
  { key: 'Region', icon: <Globe className="h-3 w-3" /> },
]

const PROVIDER_LOGO: Record<string, string> = {
  aws: '🟠 AWS',
  gcp: '🔵 GCP',
  azure: '🔷 Azure',
}

function StatusBadge({ status }: { status: ServiceNodeData['status'] }) {
  if (status === 'Healthy') {
    return (
      <div className="flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400">
        <CheckCircle2 className="h-3 w-3" />
        Success
      </div>
    )
  }
  if (status === 'Degraded') {
    return (
      <div className="flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400">
        <AlertTriangle className="h-3 w-3" />
        Degraded
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 rounded-md border border-red-500/40 bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400">
      <AlertTriangle className="h-3 w-3" />
      Error
    </div>
  )
}

function ServiceNodeComponent({ id, data, selected }: NodeProps) {
  const nodeData = data as ServiceNodeData
  const { setSelectedNodeId } = useAppStore()

  const handleClick = useCallback(() => {
    setSelectedNodeId(id)
  }, [id, setSelectedNodeId])

  const activeTab = nodeData.activeTab ?? 'CPU'

  return (
    <div
      onClick={handleClick}
      className={`relative w-[300px] rounded-xl border bg-card/95 backdrop-blur-sm shadow-2xl transition-all duration-200 cursor-pointer ${
        selected
          ? 'border-emerald-500/60 shadow-emerald-500/10'
          : 'border-border/60 hover:border-border shadow-black/40'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!left-[-5px]"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!right-[-5px]"
      />

      {/* Header */}
      <div className="flex items-center justify-between px-3.5 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl leading-none">{nodeData.icon}</span>
          <span className="font-semibold text-sm text-foreground">{nodeData.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="price" className="text-xs font-mono">
            {nodeData.price}
          </Badge>
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors">
            <Settings className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Resource stats row */}
      <div className="grid grid-cols-4 gap-0 border-t border-border/30 text-center">
        <div className="border-r border-border/30 py-1.5">
          <div className="text-xs font-mono font-medium text-foreground/80">0.02</div>
        </div>
        <div className="border-r border-border/30 py-1.5">
          <div className="text-xs font-mono font-medium text-foreground/80">0.05 GB</div>
        </div>
        <div className="border-r border-border/30 py-1.5">
          <div className="text-xs font-mono font-medium text-foreground/80">10.00 GB</div>
        </div>
        <div className="py-1.5">
          <div className="text-xs font-mono font-medium text-foreground/80">1</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 border-t border-border/30">
        {TABS.map(({ key, icon }) => (
          <button
            key={key}
            className={`flex items-center justify-center gap-1 py-1.5 text-xs font-medium transition-colors ${
              activeTab === key
                ? 'bg-muted/80 text-foreground border-b-2 border-foreground/60'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
            }`}
          >
            {icon}
            <span className="hidden sm:inline">{key}</span>
          </button>
        ))}
      </div>

      {/* Slider row */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        <div className="flex-1">
          <Slider
            min={0}
            max={100}
            step={1}
            value={[nodeData.resourceValue]}
            className="pointer-events-none"
          />
        </div>
        <span className="w-8 text-right text-xs font-mono text-foreground/70">
          {nodeData.resourceValue === 0
            ? '0.00'
            : (nodeData.resourceValue / 100).toFixed(2)}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border/30 px-3 py-2">
        <StatusBadge status={nodeData.status} />
        <span className="text-xs font-semibold text-orange-400/80 font-mono">
          {PROVIDER_LOGO[nodeData.provider] ?? nodeData.provider.toUpperCase()}
        </span>
      </div>
    </div>
  )
}

export const ServiceNode = memo(ServiceNodeComponent)
