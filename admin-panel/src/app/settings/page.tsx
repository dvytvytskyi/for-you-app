'use client'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import Tabs from '@/components/ui/tabs/Tabs'
import Button from '@/components/ui/button/Button'
import Input from '@/components/form/input/InputField'

export default function SettingsPage() {
  const [developers, setDevelopers] = useState<any[]>([])
  const [facilities, setFacilities] = useState<any[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [devs, facs, locations] = await Promise.all([
        api.get('/settings/developers').catch(() => ({ data: { data: [] } })),
        api.get('/settings/facilities').catch(() => ({ data: { data: [] } })),
        api.get('/settings/locations').catch(() => ({ data: { data: [] } })),
      ])
      setDevelopers(devs.data.data || [])
      setFacilities(facs.data.data || [])
      setCountries(locations.data.data?.countries || [])
      setCities(locations.data.data?.cities || [])
      setAreas(locations.data.data?.areas || [])
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }

  const tabs = [
    {
      key: 'developers',
      label: 'Developers',
      children: <DevelopersTab developers={developers} onReload={loadData} />,
    },
    {
      key: 'facilities',
      label: 'Facilities',
      children: <FacilitiesTab facilities={facilities} onReload={loadData} />,
    },
    {
      key: 'locations',
      label: 'Locations',
      children: (
        <LocationsTab
          countries={countries}
          cities={cities}
          areas={areas}
          onReload={loadData}
        />
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
        Settings
      </h1>
      <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <Tabs items={tabs} />
      </div>
    </div>
  )
}

// Developers Tab
function DevelopersTab({ developers, onReload }: any) {
  const [newDeveloper, setNewDeveloper] = useState('')

  const handleAdd = async () => {
    if (!newDeveloper) return
    try {
      await api.post('/settings/developers', { name: newDeveloper })
      setNewDeveloper('')
      onReload()
    } catch (error) {
      console.error('Error adding developer:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Developer name"
          value={newDeveloper}
          onChange={(e) => setNewDeveloper(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>
      <div className="space-y-2">
        {developers.length === 0 ? (
          <p className="text-gray-500">No developers</p>
        ) : (
          developers.map((dev: any) => (
            <div
              key={dev.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <span className="text-gray-800 dark:text-white">{dev.name}</span>
              <button className="text-error-500 hover:text-error-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.3333 2.00004C11.5083 2.00004 11.6763 2.07019 11.8013 2.19526C11.9263 2.32033 11.9963 2.48842 11.9963 2.66344V13.3334C11.9963 13.5084 11.9263 13.6765 11.8013 13.8016C11.6763 13.9267 11.5083 13.9968 11.3333 13.9968H4.66659C4.49157 13.9968 4.32348 13.9267 4.19841 13.8016C4.07334 13.6765 4.00319 13.5084 4.00319 13.3334V2.66344C4.00319 2.48842 4.07334 2.32033 4.19841 2.19526C4.32348 2.07019 4.49157 2.00004 4.66659 2.00004H6.66659L6.66659 1.33337C6.66659 1.15835 6.73674 0.990261 6.86181 0.865189C6.98688 0.740117 7.15497 0.669968 7.32999 0.669968H8.66999C8.84501 0.669968 9.0131 0.740117 9.13817 0.865189C9.26324 0.990261 9.33339 1.15835 9.33339 1.33337V2.00004H11.3333Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Facilities Tab
function FacilitiesTab({ facilities, onReload }: any) {
  const [newFacility, setNewFacility] = useState('')

  const handleAdd = async () => {
    if (!newFacility) return
    try {
      await api.post('/settings/facilities', { name: newFacility })
      setNewFacility('')
      onReload()
    } catch (error) {
      console.error('Error adding facility:', error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder="Facility name"
          value={newFacility}
          onChange={(e) => setNewFacility(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.length === 0 ? (
          <p className="text-gray-500">No facilities</p>
        ) : (
          facilities.map((fac: any) => (
            <div
              key={fac.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <span className="text-gray-800 dark:text-white">{fac.name}</span>
              <button className="text-error-500 hover:text-error-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.3333 2.00004C11.5083 2.00004 11.6763 2.07019 11.8013 2.19526C11.9263 2.32033 11.9963 2.48842 11.9963 2.66344V13.3334C11.9963 13.5084 11.9263 13.6765 11.8013 13.8016C11.6763 13.9267 11.5083 13.9968 11.3333 13.9968H4.66659C4.49157 13.9968 4.32348 13.9267 4.19841 13.8016C4.07334 13.6765 4.00319 13.5084 4.00319 13.3334V2.66344C4.00319 2.48842 4.07334 2.32033 4.19841 2.19526C4.32348 2.07019 4.49157 2.00004 4.66659 2.00004H6.66659L6.66659 1.33337C6.66659 1.15835 6.73674 0.990261 6.86181 0.865189C6.98688 0.740117 7.15497 0.669968 7.32999 0.669968H8.66999C8.84501 0.669968 9.0131 0.740117 9.13817 0.865189C9.26324 0.990261 9.33339 1.15835 9.33339 1.33337V2.00004H11.3333Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// Locations Tab
function LocationsTab({ countries, cities, areas, onReload }: any) {
  const [activeSection, setActiveSection] = useState<'countries' | 'cities' | 'areas'>('countries')
  const [newItem, setNewItem] = useState('')

  const handleAdd = async () => {
    if (!newItem) return
    try {
      const endpoint = `/settings/${activeSection}`
      await api.post(endpoint, { name: newItem })
      setNewItem('')
      onReload()
    } catch (error) {
      console.error('Error adding location:', error)
    }
  }

  const items = activeSection === 'countries' ? countries : activeSection === 'cities' ? cities : areas

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setActiveSection('countries')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeSection === 'countries'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Countries
        </button>
        <button
          onClick={() => setActiveSection('cities')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeSection === 'cities'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Cities
        </button>
        <button
          onClick={() => setActiveSection('areas')}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            activeSection === 'areas'
              ? 'border-brand-500 text-brand-500'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Areas
        </button>
      </div>

      <div className="flex items-center gap-4">
        <Input
          type="text"
          placeholder={`${activeSection === 'countries' ? 'Country' : activeSection === 'cities' ? 'City' : 'Area'} name`}
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1"
        />
        <Button onClick={handleAdd}>Add</Button>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 ? (
          <p className="text-gray-500">No items</p>
        ) : (
          items.map((item: any) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800"
            >
              <span className="text-gray-800 dark:text-white">{item.name}</span>
              <button className="text-error-500 hover:text-error-600">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M11.3333 2.00004C11.5083 2.00004 11.6763 2.07019 11.8013 2.19526C11.9263 2.32033 11.9963 2.48842 11.9963 2.66344V13.3334C11.9963 13.5084 11.9263 13.6765 11.8013 13.8016C11.6763 13.9267 11.5083 13.9968 11.3333 13.9968H4.66659C4.49157 13.9968 4.32348 13.9267 4.19841 13.8016C4.07334 13.6765 4.00319 13.5084 4.00319 13.3334V2.66344C4.00319 2.48842 4.07334 2.32033 4.19841 2.19526C4.32348 2.07019 4.49157 2.00004 4.66659 2.00004H6.66659L6.66659 1.33337C6.66659 1.15835 6.73674 0.990261 6.86181 0.865189C6.98688 0.740117 7.15497 0.669968 7.32999 0.669968H8.66999C8.84501 0.669968 9.0131 0.740117 9.13817 0.865189C9.26324 0.990261 9.33339 1.15835 9.33339 1.33337V2.00004H11.3333Z" fill="currentColor"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
