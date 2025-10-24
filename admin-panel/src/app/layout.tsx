import type { Metadata } from 'next'
import { ConfigProvider } from 'antd'
import ukUA from 'antd/locale/uk_UA'
import 'antd/dist/reset.css'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'For You Real Estate - Адмін Панель',
  description: 'Панель адміністратора для управління платформою For You Real Estate',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk">
      <body>
        <ConfigProvider locale={ukUA}>
          {children}
        </ConfigProvider>
      </body>
    </html>
  )
}

