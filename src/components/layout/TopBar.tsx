import { useState } from 'react'
import { Share2, Moon, Sun, Maximize2, AlertTriangle, PanelRight, ChevronUp, MoreHorizontal } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'
import { useApps } from '@/hooks/useApps'
import { toggleError } from '@/mocks/data'

interface TopBarProps {
  onFitView: () => void
  isDark: boolean
  onToggleDark: () => void
}

export function TopBar({ onFitView, isDark, onToggleDark }: TopBarProps) {
  const [isError, setIsError] = useState(false)
  const { selectedAppId, toggleMobilePanel } = useAppStore()
  const { data: apps } = useApps()
  const qc = useQueryClient()

  const selectedApp = apps?.find((a) => a.id === selectedAppId)

  async function handleToggleError() {
    const next = toggleError()
    setIsError(next)
    await qc.invalidateQueries({ queryKey: ['apps'] })
    await qc.invalidateQueries({ queryKey: ['graph'] })
  }

  return (
    <header className="flex h-11 items-center justify-between border-b border-border/50 bg-card/80 backdrop-blur-sm px-3 flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">Z</div>
        <div className="flex items-center gap-1.5 rounded-md border border-border/60 bg-muted/40 px-2.5 py-1 text-sm">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedApp?.color ?? '#6366f1' }} />
          <span className="max-w-[160px] truncate font-medium text-foreground/90">{selectedApp?.name ?? 'Loading...'}</span>
          <ChevronUp className="h-3 w-3 text-muted-foreground" />
          <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" onClick={handleToggleError} title={isError ? 'Disable error simulation' : 'Simulate API error'} className={isError ? 'text-red-400 hover:text-red-300' : 'text-muted-foreground'}>
          <AlertTriangle className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onFitView} title="Fit view"><Maximize2 className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" title="Share"><Share2 className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon" onClick={onToggleDark} title="Toggle theme">
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobilePanel} title="Toggle panel">
          <PanelRight className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}
