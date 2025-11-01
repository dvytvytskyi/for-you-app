'use client'
import { Table, message } from 'antd'
import AdminLayout from '@/components/Layout/AdminLayout'
import ProtectedRoute from '@/components/Layout/ProtectedRoute'

export default function UsersPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Користувачі</h1>
        <Table dataSource={[]} columns={[]} loading={false} />
      </AdminLayout>
    </ProtectedRoute>
  )
}

