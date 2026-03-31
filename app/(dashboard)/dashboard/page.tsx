import { DashboardContent } from './dashboard-content'
import PrivateRoute from '@/components/PrivateRoute'

export default function DashboardPage() {
  return (
    <PrivateRoute>
      <div className="p-6 lg:p-8">
        <DashboardContent />
      </div>
    </PrivateRoute>
  )
}
