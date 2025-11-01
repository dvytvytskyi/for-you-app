'use client'
import { Card, Row, Col, Statistic } from 'antd'
import { HomeOutlined, UserOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons'
import AdminLayout from '@/components/Layout/AdminLayout'
import ProtectedRoute from '@/components/Layout/ProtectedRoute'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    support: 0,
    courses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [props, news, support, courses] = await Promise.all([
        api.get('/properties'),
        api.get('/news'),
        api.get('/support'),
        api.get('/courses'),
      ])
      setStats({
        properties: props.data.data.length,
        users: 0,
        support: support.data.data.length,
        courses: courses.data.data.length,
      })
    } catch (error) {
      console.error('Error loading stats', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <h1 style={{ fontSize: '28px', marginBottom: '24px' }}>Dashboard</h1>
        
        <Row gutter={16} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Нерухомість"
                value={stats.properties}
                prefix={<HomeOutlined />}
                valueStyle={{ color: '#1890ff' }}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Користувачі"
                value={stats.users}
                prefix={<UserOutlined />}
                valueStyle={{ color: '#52c41a' }}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Запити підтримки"
                value={stats.support}
                prefix={<MessageOutlined />}
                valueStyle={{ color: '#faad14' }}
                loading={loading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card>
              <Statistic
                title="Курси"
                value={stats.courses}
                prefix={<BookOutlined />}
                valueStyle={{ color: '#f5222d' }}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} lg={12}>
            <Card title="Останні активності">
              <p>Тут буде відображатись остання активність</p>
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Статистика">
              <p>Тут буде відображатись статистика</p>
            </Card>
          </Col>
        </Row>
      </AdminLayout>
    </ProtectedRoute>
  )
}

