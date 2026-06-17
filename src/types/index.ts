import type { Node, Edge } from '@xyflow/react'

export type NodeStatus = 'Healthy' | 'Degraded' | 'Down'
export type ResourceTab = 'CPU' | 'Memory' | 'Disk' | 'Region'
export type CloudProvider = 'aws' | 'gcp' | 'azure'

export interface App {
  id: string
  name: string
  color: string
  emoji: string
}

export interface ServiceNodeData extends Record<string, unknown> {
  label: string
  status: NodeStatus
  price: string
  resourceValue: number
  activeTab: ResourceTab
  icon: string
  provider: CloudProvider
  description: string
}

export type ServiceNode = Node<ServiceNodeData, 'service'>

export interface GraphData {
  nodes: ServiceNode[]
  edges: Edge[]
}
