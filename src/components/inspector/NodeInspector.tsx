import { useState, useEffect } from 'react'
import { Activity, Cpu, HardDrive, MemoryStick, Globe, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppStore } from '@/store/useAppStore'
import type { ServiceNodeData, NodeStatus } from '@/types'

interface NodeInspectorProps {
  nodeData: ServiceNodeData | null
  onUpdateNodeData: (patch: Partial<ServiceNodeData>) => void
  isLoading?: boolean
}

function StatusBadge({ status }: { status: NodeStatus }) {
  if (status === 'Healthy') {
    return (
      <Badge variant="success" className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Success
      </Badge>
    )
  }
  if (status === 'Degraded') {
    return (
      <Badge variant="warning" className="gap-1">
        <AlertTriangle className="h-3 w-3" />
        Degraded
      </Badge>
    )
  }
  return (
    <Badge variant="error" className="gap-1">
      <XCircle className="h-3 w-3" />
      Error
    </Badge>
  )
}

export function NodeInspector({ nodeData, onUpdateNodeData, isLoading }: NodeInspectorProps) {
  const { activeInspectorTab, setActiveInspectorTab } = useAppStore()
  const [sliderVal, setSliderVal] = useState(nodeData?.resourceValue ?? 50)
  const [inputVal, setInputVal] = useState(String(nodeData?.resourceValue ?? 50))

  useEffect(() => {
    if (nodeData) {
      setSliderVal(nodeData.resourceValue)
      setInputVal(String(nodeData.resourceValue))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeData?.label, nodeData?.resourceValue])

  if (isLoading) {
    return (
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    )
  }

  if (!nodeData) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground gap-3">
        <div className="text-3xl opacity-30">◎</div>
        <p className="text-xs leading-relaxed">
          Click a node on the canvas to inspect its config and runtime details.
        </p>
      </div>
    )
  }

  function handleSliderChange(val: number[]) {
    const v = val[0]
    setSliderVal(v)
    setInputVal(String(v))
    onUpdateNodeData({ resourceValue: v })
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value)
    const n = parseInt(e.target.value, 10)
    if (!isNaN(n) && n >= 0 && n <= 100) {
      setSliderVal(n)
      onUpdateNodeData({ resourceValue: n })
    }
  }

  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="border-b border-border/50 p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{nodeData.icon}</span>
            <span className="font-semibold text-sm">{nodeData.label}</span>
          </div>
          <StatusBadge status={nodeData.status} />
        </div>
        <Badge variant="price" className="font-mono text-xs">
          {nodeData.price}
        </Badge>
      </div>

      {/* Inspector Tabs */}
      <Tabs
        value={activeInspectorTab}
        onValueChange={(v) => setActiveInspectorTab(v as typeof activeInspectorTab)}
        className="flex flex-col flex-1"
      >
        <TabsList className="mx-3 mt-3 w-auto self-start">
          <TabsTrigger value="CPU">
            <Cpu className="h-3 w-3 mr-1" />
            Config
          </TabsTrigger>
          <TabsTrigger value="Memory">
            <Activity className="h-3 w-3 mr-1" />
            Runtime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="CPU" className="px-3 pb-3 space-y-4">
          {/* Name field */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Service Name
            </label>
            <Input
              value={nodeData.label}
              onChange={(e) => onUpdateNodeData({ label: e.target.value })}
              className="h-8 text-sm"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Description
            </label>
            <textarea
              value={nodeData.description}
              onChange={(e) => onUpdateNodeData({ description: e.target.value })}
              rows={2}
              className="w-full rounded-md border border-input bg-transparent px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
            />
          </div>

          {/* Status selector */}
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground uppercase tracking-wide">
              Status
            </label>
            <div className="flex gap-2">
              {(['Healthy', 'Degraded', 'Down'] as NodeStatus[]).map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateNodeData({ status: s })}
                  className={`flex-1 rounded-md border px-2 py-1 text-xs font-medium transition-colors ${
                    nodeData.status === s
                      ? s === 'Healthy'
                        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                        : s === 'Degraded'
                          ? 'border-amber-500/50 bg-amber-500/10 text-amber-400'
                          : 'border-red-500/50 bg-red-500/10 text-red-400'
                      : 'border-border/50 text-muted-foreground hover:bg-muted/50'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Resource allocation slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-muted-foreground uppercase tracking-wide">
                CPU Allocation
              </label>
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  max={100}
                  value={inputVal}
                  onChange={handleInputChange}
                  className="h-6 w-14 text-center text-xs font-mono px-1"
                />
                <span className="text-xs text-muted-foreground">%</span>
              </div>
            </div>
            <Slider
              min={0}
              max={100}
              step={1}
              value={[sliderVal]}
              onValueChange={handleSliderChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="Memory" className="px-3 pb-3 space-y-3">
          {/* Runtime metrics */}
          {[
            { icon: <Cpu className="h-3.5 w-3.5" />, label: 'CPU Usage', value: `${nodeData.resourceValue}%`, color: 'text-blue-400' },
            { icon: <MemoryStick className="h-3.5 w-3.5" />, label: 'Memory', value: '0.05 GB', color: 'text-purple-400' },
            { icon: <HardDrive className="h-3.5 w-3.5" />, label: 'Disk', value: '10.00 GB', color: 'text-amber-400' },
            { icon: <Globe className="h-3.5 w-3.5" />, label: 'Region', value: 'us-east-1', color: 'text-cyan-400' },
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="flex items-center justify-between rounded-md border border-border/40 bg-muted/30 px-3 py-2">
              <div className={`flex items-center gap-2 text-xs ${color}`}>
                {icon}
                <span className="text-muted-foreground">{label}</span>
              </div>
              <span className="text-xs font-mono text-foreground/80">{value}</span>
            </div>
          ))}

          {/* Provider */}
          <div className="mt-2 flex items-center justify-between rounded-md border border-border/40 bg-muted/30 px-3 py-2">
            <span className="text-xs text-muted-foreground">Provider</span>
            <span className="text-xs font-mono uppercase text-orange-400">{nodeData.provider}</span>
          </div>

          {/* Instance info */}
          <div className="rounded-md border border-border/40 bg-muted/20 p-3 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-mono text-emerald-400">14d 6h 22m</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Requests/min</span>
              <span className="font-mono">2,847</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Avg latency</span>
              <span className="font-mono">12ms</span>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
