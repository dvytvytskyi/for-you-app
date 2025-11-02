'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    properties: 0,
    users: 0,
    courses: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [props, courses] = await Promise.all([
        api.get('/properties'),
        api.get('/courses'),
      ])
      setStats({
        properties: props.data.data.length,
        users: 0,
        courses: courses.data.data.length,
      })
    } catch (error) {
      console.error('Error loading stats', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* Stats Cards */}
      <div className="col-span-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Properties Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Properties
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white">
                  {loading ? '...' : stats.properties}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/10">
                <svg className="fill-blue-500 dark:fill-blue-400" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Users Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Users
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white">
                  {loading ? '...' : stats.users}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 dark:bg-green-500/10">
                <svg className="fill-green-500 dark:fill-green-400" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Courses Card */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Courses
                </p>
                <p className="mt-2 text-2xl font-semibold text-gray-800 dark:text-white">
                  {loading ? '...' : stats.courses}
                </p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-500/10">
                <svg className="fill-purple-500 dark:fill-purple-400" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19ZM17 12H7V10H17V12ZM15 16H7V14H15V16ZM17 8H7V6H17V8Z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="col-span-12 lg:col-span-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Recent Activity
          </h3>
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Recent activity will be displayed here
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="col-span-12 lg:col-span-6">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-theme-xs dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">
            Statistics
          </h3>
          <div className="flex items-center justify-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              Statistics will be displayed here
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
