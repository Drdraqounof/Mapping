import { redirect } from 'next/navigation'
import FleetDashboard from '../../components/FleetDashboard'
import { getSession } from '../../lib/auth'
import { roboto } from '../fonts'

export default async function Page() {
  const session = await getSession()
  if (!session) redirect('/login?next=/dashboard')
  return (
    <div className={roboto.className}>
      <FleetDashboard user={session.sub} />
    </div>
  )
}
