'use client'

import { Typography, Card, Row, Col } from 'antd'
import { 
  UserOutlined, 
  HomeOutlined, 
  FileTextOutlined, 
  BellOutlined 
} from '@ant-design/icons'

const { Title, Paragraph } = Typography

export default function Home() {
  return (
    <div style={{ padding: '50px' }}>
      <Title level={1}>👋 Вітаємо в For You Real Estate</Title>
      <Paragraph style={{ fontSize: '18px', marginBottom: '40px' }}>
        Панель адміністратора для управління платформою нерухомості
      </Paragraph>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <UserOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <Title level={3}>Користувачі</Title>
            <Paragraph>Управління інвесторами, брокерами та клієнтами</Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <HomeOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
            <Title level={3}>Нерухомість</Title>
            <Paragraph>Модерація та управління об'єктами</Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <FileTextOutlined style={{ fontSize: '48px', color: '#faad14' }} />
            <Title level={3}>Заявки</Title>
            <Paragraph>Обробка лідів та призначення брокерам</Paragraph>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card hoverable>
            <BellOutlined style={{ fontSize: '48px', color: '#f5222d' }} />
            <Title level={3}>Сповіщення</Title>
            <Paragraph>Push-повідомлення та розсилки</Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

