'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import Image from 'next/image'

export default function SupportPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRequests()
  }, [])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/support')
      setRequests(data.data || [])
    } catch (error) {
      console.error('Error loading support requests:', error)
      // Mock data for development
      setRequests([
        {
          id: 1,
          user: {
            name: 'John Smith',
            email: 'john.smith@example.com',
            avatar: 'https://i.pravatar.cc/150?img=1',
          },
          subject: 'Payment issue',
          message: 'I am having trouble processing my payment',
          status: 'open',
          createdAt: '2024-01-15T10:30:00Z',
          priority: 'high',
        },
        {
          id: 2,
          user: {
            name: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            avatar: 'https://i.pravatar.cc/150?img=2',
          },
          subject: 'Account access',
          message: 'Cannot log into my account',
          status: 'in-progress',
          createdAt: '2024-01-16T14:20:00Z',
          priority: 'medium',
        },
        {
          id: 3,
          user: {
            name: 'Michael Brown',
            email: 'm.brown@example.com',
            avatar: 'https://i.pravatar.cc/150?img=3',
          },
          subject: 'General question',
          message: 'How do I reset my password?',
          status: 'resolved',
          createdAt: '2024-01-17T09:15:00Z',
          priority: 'low',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'error'
      case 'in-progress':
        return 'warning'
      case 'resolved':
        return 'success'
      case 'closed':
        return 'light'
      default:
        return 'light'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open':
        return 'Open'
      case 'in-progress':
        return 'In Progress'
      case 'resolved':
        return 'Resolved'
      case 'closed':
        return 'Closed'
      default:
        return status
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error'
      case 'medium':
        return 'warning'
      case 'low':
        return 'success'
      default:
        return 'light'
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'High'
      case 'medium':
        return 'Medium'
      case 'low':
        return 'Low'
      default:
        return priority
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
          Support
        </h1>
        <div className="flex items-center gap-2">
          <Badge size="md" color="error">
            {requests.filter(r => r.status === 'open').length} Open
          </Badge>
          <Badge size="md" color="warning">
            {requests.filter(r => r.status === 'in-progress').length} In Progress
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="max-w-full overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/5">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  User
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Subject
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Priority
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Date
                </TableCell>
                <TableCell isHeader className="px-5 py-3 font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="px-5 py-8 text-center text-gray-500">
                    No requests
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={request.user?.avatar || 'https://i.pravatar.cc/150?img=5'}
                            alt={request.user?.name || 'User'}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {request.user?.name || 'Unknown User'}
                          </span>
                          <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                            {request.user?.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div>
                        <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {request.subject}
                        </span>
                        <span className="block text-gray-500 text-theme-xs dark:text-gray-400 line-clamp-1">
                          {request.message}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge size="sm" color={getStatusBadgeColor(request.status)}>
                        {getStatusLabel(request.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge size="sm" color={getPriorityBadgeColor(request.priority)}>
                        {getPriorityLabel(request.priority)}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <span className="block text-gray-500 text-theme-sm dark:text-gray-400">
                        {formatDate(request.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M11.3333 2.00004H4.66659C3.93021 2.00004 3.33325 2.59699 3.33325 3.33337V13.3334C3.33325 14.0698 3.93021 14.6667 4.66659 14.6667H11.3333C12.0696 14.6667 12.6666 14.0698 12.6666 13.3334V5.05337C12.6666 4.68443 12.5254 4.33033 12.2754 4.08033L9.94659 1.75162C9.69659 1.50162 9.34249 1.3604 8.97355 1.3604H4.66659C3.93021 1.3604 3.33325 1.95735 3.33325 2.69373V13.3334C3.33325 14.0698 3.93021 14.6667 4.66659 14.6667H11.3333C12.0696 14.6667 12.6666 14.0698 12.6666 13.3334V5.05337C12.6666 4.68443 12.5254 4.33033 12.2754 4.08033L9.94659 1.75162C9.69659 1.50162 9.34249 1.3604 8.97355 1.3604ZM8.97355 2.3604L11.3022 4.68911H8.97355V2.3604Z" fill="currentColor"/>
                          </svg>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 12L13 7H10V2H6V7H3L8 12Z" fill="currentColor"/>
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
