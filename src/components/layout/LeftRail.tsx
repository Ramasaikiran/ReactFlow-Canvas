import { useAppStore } from '@/store/useAppStore'
import { useApps } from '@/hooks/useApps'

// Service icons matching the screenshot style
const NAV_ICONS = [
  { emoji: '🐙', label: 'GitHub', color: '#e2e8f0' },
  { emoji: '🐘', label: 'Postgres', color: '#336791' },
  { emoji: '🔴', label: 'Redis', color: '#dc2626' },
  { emoji: '🍃', label: 'MongoDB', color: '#16a34a' },
  { emoji: '📦', label: 'Package', color: '#7c3aed' },
  { emoji: '📊', label: 'Dashboard', color: '#d97706' },
  { emoji: '🔗', label: 'Network', color: '#0284c7' },
]

export function LeftRail() {
  const { selectedAppId, setSelectedAppId } = useAppStore()
  const { data: apps } = useApps()

  return (
    <aside className="flex w-12 flex-col items-center gap-1 border-r border-border/50 bg-card/60 py-3 flex-shrink-0">
      {/* Static nav icons */}
      {NAV_ICONS.slice(0, 4).map(({ emoji, label }) => (
        <button
          key={label}
          title={label}
          className="flex h-9 w-9 items-center justify-center rounded-md text-lg transition-colors hover:bg-muted/60 text-muted-foreground hover:text-foreground"
        >
          {emoji}
        </button>
      ))}

      <div className="my-1 h-px w-6 bg-border/50" />

      {/* App shortcuts */}
      {apps?.map((app) => (
        <button
          key={app.id}
          title={app.name}
          onClick={() => setSelectedAppId(app.id)}
          className={`flex h-9 w-9 items-center justify-center rounded-md text-base transition-all ${
            selectedAppId === app.id
              ? 'ring-2 ring-offset-1 ring-offset-card opacity-100'
              : 'opacity-60 hover:opacity-100 hover:bg-muted/60'
          }`}
          style={
            selectedAppId === app.id
              ? { outline: `2px solid ${app.color}`, outlineOffset: '2px', backgroundColor: `${app.color}22` }
              : {}
          }
        >
          {app.emoji}
        </button>
      ))}

      <div className="my-1 h-px w-6 bg-border/50" />

      {NAV_ICONS.slice(4).map(({ emoji, label }) => (
        <button
          key={label}
          title={label}
          className="flex h-9 w-9 items-center justify-center rounded-md text-lg transition-colors hover:bg-muted/60 text-muted-foreground hover:text-foreground"
        >
          {emoji}
        </button>
      ))}
    </aside>
  )
}
