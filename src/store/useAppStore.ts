import { create } from 'zustand'
import type { ResourceTab } from '@/types'

interface AppStore {
  selectedAppId: string
  selectedNodeId: string | null
  isMobilePanelOpen: boolean
  activeInspectorTab: ResourceTab

  setSelectedAppId: (id: string) => void
  setSelectedNodeId: (id: string | null) => void
  toggleMobilePanel: () => void
  setMobilePanelOpen: (open: boolean) => void
  setActiveInspectorTab: (tab: ResourceTab) => void
}

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: 'app-1',
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'CPU',

  setSelectedAppId: (id) => set({ selectedAppId: id, selectedNodeId: null }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  toggleMobilePanel: () =>
    set((s) => ({ isMobilePanelOpen: !s.isMobilePanelOpen })),
  setMobilePanelOpen: (open) => set({ isMobilePanelOpen: open }),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
}))
