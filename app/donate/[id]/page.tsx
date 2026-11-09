import { SEED_CAMPAIGNS } from '@/lib/seed'
import { DonateView } from './view'

export const metadata = { title: 'Give' }

export function generateStaticParams() {
  return SEED_CAMPAIGNS.map((c) => ({ id: c.id }))
}

export default async function DonatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <DonateView id={id} />
}
