'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import Image from 'next/image'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import Badge from '@/components/ui/badge/Badge'
import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'
import Pagination from '@/components/tables/Pagination'

export default function PropertiesPage() {
  const router = useRouter()
  const [properties, setProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [propertyType, setPropertyType] = useState<'off-plan' | 'secondary'>('off-plan')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(100)

  useEffect(() => {
    loadProperties()
  }, [propertyType])

  useEffect(() => {
    filterProperties()
    setCurrentPage(1) // Reset to first page when search changes
  }, [searchQuery, properties])

  const loadProperties = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/properties')
      // Filter by property type
      const filtered = data.data.filter((prop: any) => prop.propertyType === propertyType)
      setProperties(filtered)
      setFilteredProperties(filtered)
      setCurrentPage(1)
    } catch (error) {
      console.error('Error loading properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterProperties = () => {
    let filtered = [...properties]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (prop) =>
          prop.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prop.id?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredProperties(filtered)
  }

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedProperties = filteredProperties.slice(startIndex, endIndex)
  
  // Debug log
  console.log('Pagination debug:', {
    filteredPropertiesLength: filteredProperties.length,
    itemsPerPage,
    totalPages,
    currentPage,
    startIndex,
    endIndex,
    paginatedPropertiesLength: paginatedProperties.length,
  })

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Properties</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => router.push('/properties/add')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M8 3V13M3 8H13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Add Property
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Property Type Toggle */}
        <div className="inline-flex rounded-lg border border-gray-200 p-1 dark:border-gray-800 dark:bg-gray-900">
          <button
            onClick={() => setPropertyType('off-plan')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              propertyType === 'off-plan'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
            }`}
          >
            Off-Plan
          </button>
          <button
            onClick={() => setPropertyType('secondary')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              propertyType === 'secondary'
                ? 'bg-brand-500 text-white'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5'
            }`}
          >
            Secondary
          </button>
        </div>

        {/* Search */}
        <div className="w-full sm:w-auto sm:min-w-[300px]">
          <Input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Datatable */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Property
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Location
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Price
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Bedrooms
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Size
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    Last Visited
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-5 py-8 text-center text-gray-500">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginatedProperties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="px-5 py-8 text-center text-gray-500">
                      {searchQuery ? 'No properties found' : 'No properties'}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProperties.map((property) => (
                    <TableRow 
                      key={property.id} 
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => router.push(`/properties/edit/${property.id}`)}
                    >
                      <TableCell className="px-5 py-4 sm:px-6 text-start">
                        <div className="flex items-center gap-3">
                          {property.photos?.[0] && (
                            <div className="w-12 h-12 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                              <Image
                                width={48}
                                height={48}
                                src={property.photos[0]}
                                alt={property.name || 'Property'}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )}
                          <div>
                            <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {property.name || 'Unnamed Property'}
                            </span>
                            <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                              ID: {property.id?.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {property.area?.nameEn || property.city?.nameEn || '-'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-800 text-start text-theme-sm dark:text-white/90 font-medium">
                        {property.price
                          ? `$${property.price.toLocaleString()}`
                          : property.priceFrom
                            ? `From $${property.priceFrom.toLocaleString()}`
                            : '-'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {property.bedrooms
                          ? property.bedrooms
                          : property.bedroomsFrom && property.bedroomsTo
                            ? `${property.bedroomsFrom}-${property.bedroomsTo}`
                            : '-'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {property.size
                          ? `${property.size} sq.m`
                          : property.sizeFrom && property.sizeTo
                            ? `${property.sizeFrom}-${property.sizeTo} sq.m`
                            : '-'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <Badge size="sm" color="success">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                        {property.updatedAt
                          ? new Date(property.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : property.createdAt
                            ? new Date(property.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {filteredProperties.length > 0
            ? `Showing ${startIndex + 1} to ${Math.min(endIndex, filteredProperties.length)} of ${filteredProperties.length} properties`
            : 'No properties found'}
        </p>
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}
