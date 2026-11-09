import type { Metadata } from 'next'
import { SEED_CAMPAIGNS } from '@/lib/seed'
import { CampaignView } from './view'

export function generateStaticParams() {
  return SEED_CAMPAIGNS.map((c) => ({ id: c.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const c = SEED_CAMPAIGNS.find((x) => x.id === id)
  return { title: c ? c.title : 'Campaign', description: c?.summary }
}

export default async function CampaignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <CampaignView id={id} />
}
