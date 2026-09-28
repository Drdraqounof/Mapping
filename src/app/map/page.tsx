import { redirect } from 'next/navigation'
import FleetDashboard from '../../components/FleetDashboard'
import { getSession } from '../../lib/auth'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login?next=/map')
  return <FleetDashboard user={session.sub} />
}
