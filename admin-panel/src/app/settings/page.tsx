'use client'
import { Tabs, message } from 'antd'
import AdminLayout from '@/components/Layout/AdminLayout'
import ProtectedRoute from '@/components/Layout/ProtectedRoute'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Налаштування</h1>
        <Tabs
          items={[
            { key: 'developers', label: 'Девелопери', children: <div>Девелопери - скоро</div> },
            { key: 'facilities', label: 'Зручності', children: <div>Зручності - скоро</div> },
            { key: 'locations', label: 'Локації', children: <div>Локації - скоро</div> },
          ]}
        />
      </AdminLayout>
    </ProtectedRoute>
  )
}

