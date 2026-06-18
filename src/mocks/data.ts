import type { App, GraphData } from '@/types'

export const APPS: App[] = [
  { id: 'app-1', name: 'supertokens-golang', color: '#6366f1', emoji: '💡' },
  { id: 'app-2', name: 'supertokens-java', color: '#8b5cf6', emoji: '⚙️' },
  { id: 'app-3', name: 'supertokens-python', color: '#ef4444', emoji: '🚀' },
  { id: 'app-4', name: 'supertokens-ruby', color: '#a855f7', emoji: '📦' },
  { id: 'app-5', name: 'supertokens-go', color: '#ec4899', emoji: '🧩' },
]

export const GRAPHS: Record<string, GraphData> = {
  'app-1': {
    nodes: [
      { id: 'n1', type: 'service', position: { x: 60, y: 60 }, data: { label: 'Postgres', status: 'Healthy', price: '$0.03/HR', resourceValue: 68, activeTab: 'CPU', icon: '🐘', provider: 'aws', description: 'Primary PostgreSQL database instance' } },
      { id: 'n2', type: 'service', position: { x: 60, y: 300 }, data: { label: 'Redis', status: 'Down', price: '$0.03/HR', resourceValue: 42, activeTab: 'CPU', icon: '🔴', provider: 'aws', description: 'In-memory cache and session store' } },
      { id: 'n3', type: 'service', position: { x: 380, y: 180 }, data: { label: 'MongoDB', status: 'Down', price: '$0.03/HR', resourceValue: 85, activeTab: 'CPU', icon: '🍃', provider: 'aws', description: 'Document store for user profiles' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n3' },
      { id: 'e2', source: 'n2', target: 'n3' },
    ],
  },
  'app-2': {
    nodes: [
      { id: 'n1', type: 'service', position: { x: 60, y: 80 }, data: { label: 'MySQL', status: 'Healthy', price: '$0.05/HR', resourceValue: 30, activeTab: 'CPU', icon: '🐬', provider: 'gcp', description: 'Relational DB for Java service' } },
      { id: 'n2', type: 'service', position: { x: 400, y: 80 }, data: { label: 'Kafka', status: 'Degraded', price: '$0.08/HR', resourceValue: 72, activeTab: 'CPU', icon: '⚡', provider: 'aws', description: 'Event streaming platform' } },
      { id: 'n3', type: 'service', position: { x: 220, y: 300 }, data: { label: 'Elasticsearch', status: 'Healthy', price: '$0.12/HR', resourceValue: 55, activeTab: 'CPU', icon: '🔍', provider: 'aws', description: 'Search and analytics engine' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2', animated: true },
      { id: 'e2', source: 'n1', target: 'n3' },
    ],
  },
  'app-3': {
    nodes: [
      { id: 'n1', type: 'service', position: { x: 60, y: 150 }, data: { label: 'DynamoDB', status: 'Healthy', price: '$0.02/HR', resourceValue: 20, activeTab: 'CPU', icon: '⚡', provider: 'aws', description: 'NoSQL key-value store' } },
      { id: 'n2', type: 'service', position: { x: 420, y: 150 }, data: { label: 'S3 Bucket', status: 'Healthy', price: '$0.01/HR', resourceValue: 10, activeTab: 'Disk', icon: '🪣', provider: 'aws', description: 'Object storage for assets' } },
      { id: 'n3', type: 'service', position: { x: 240, y: 330 }, data: { label: 'Lambda', status: 'Degraded', price: '$0.00/HR', resourceValue: 5, activeTab: 'CPU', icon: 'λ', provider: 'aws', description: 'Serverless compute functions' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n3', animated: true },
      { id: 'e2', source: 'n2', target: 'n3', animated: true },
    ],
  },
  'app-4': {
    nodes: [
      { id: 'n1', type: 'service', position: { x: 60, y: 200 }, data: { label: 'Postgres', status: 'Healthy', price: '$0.03/HR', resourceValue: 45, activeTab: 'CPU', icon: '🐘', provider: 'gcp', description: 'Managed PostgreSQL on GCP' } },
      { id: 'n2', type: 'service', position: { x: 380, y: 80 }, data: { label: 'Memcached', status: 'Healthy', price: '$0.02/HR', resourceValue: 22, activeTab: 'Memory', icon: '🧠', provider: 'aws', description: 'Distributed memory cache' } },
      { id: 'n3', type: 'service', position: { x: 380, y: 320 }, data: { label: 'RabbitMQ', status: 'Down', price: '$0.04/HR', resourceValue: 90, activeTab: 'CPU', icon: '🐰', provider: 'azure', description: 'Message broker service' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n1', target: 'n3' },
    ],
  },
  'app-5': {
    nodes: [
      { id: 'n1', type: 'service', position: { x: 60, y: 80 }, data: { label: 'CockroachDB', status: 'Healthy', price: '$0.09/HR', resourceValue: 38, activeTab: 'CPU', icon: '🪳', provider: 'aws', description: 'Distributed SQL database' } },
      { id: 'n2', type: 'service', position: { x: 400, y: 200 }, data: { label: 'Cassandra', status: 'Degraded', price: '$0.07/HR', resourceValue: 60, activeTab: 'Disk', icon: '🗄️', provider: 'aws', description: 'Wide-column distributed store' } },
      { id: 'n3', type: 'service', position: { x: 200, y: 340 }, data: { label: 'InfluxDB', status: 'Healthy', price: '$0.05/HR', resourceValue: 25, activeTab: 'CPU', icon: '📊', provider: 'gcp', description: 'Time-series database' } },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n1', target: 'n3', animated: true },
    ],
  },
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

let forceError = false

export function toggleError() {
  forceError = !forceError
  return forceError
}

export async function fetchApps(): Promise<App[]> {
  await delay(400)
  if (forceError) throw new Error('Simulated error')
  return APPS
}

export async function fetchGraph(appId: string): Promise<GraphData> {
  await delay(600)
  if (forceError) throw new Error('Simulated error')
  return GRAPHS[appId] ?? GRAPHS['app-1']
}
