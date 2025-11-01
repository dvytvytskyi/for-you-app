'use client'
import { useState } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useRouter } from 'next/navigation'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import axios from 'axios'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/login`, {
        email: values.email,
        password: values.password,
      })

      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token)
        message.success('Успішний вхід!')
        router.push('/dashboard')
      } else {
        message.error('Невірний email або пароль')
      }
    } catch (error) {
      message.error('Помилка входу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        title={<div style={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>Адмін Панель</div>}
        style={{ width: 400 }}
      >
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item 
            name="email" 
            rules={[{ required: true, message: 'Введіть email' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              type="email" 
              size="large"
            />
          </Form.Item>
          <Form.Item 
            name="password" 
            rules={[{ required: true, message: 'Введіть пароль' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Пароль" 
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading} 
              block 
              size="large"
            >
              Увійти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

