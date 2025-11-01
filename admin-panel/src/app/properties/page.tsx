'use client'
import { Table, Button, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import AdminLayout from '@/components/Layout/AdminLayout'
import ProtectedRoute from '@/components/Layout/ProtectedRoute'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function PropertiesPage() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/properties')
      setProperties(data.data)
    } catch (error) {
      message.error('Помилка завантаження нерухомості')
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: 'Назва', dataIndex: 'name', key: 'name' },
    { title: 'Тип', dataIndex: 'propertyType', key: 'propertyType' },
    {
      title: 'Дії',
      render: (_, record: any) => (
        <Space>
          <Button onClick={() => message.info('Edit - скоро')}>Редагувати</Button>
          <Button danger onClick={() => message.info('Delete - скоро')}>Видалити</Button>
        </Space>
      ),
    },
  ]

  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Нерухомість</h1>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: '16px' }} onClick={() => message.info('Create - скоро')}>
          Додати нерухомість
        </Button>
        <Table dataSource={properties} columns={columns} loading={loading} rowKey="id" />
      </AdminLayout>
    </ProtectedRoute>
  )
}

