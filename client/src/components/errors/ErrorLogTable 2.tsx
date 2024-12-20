'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { RobotError } from '@/types/robotErrors'
import { formatDistanceToNow } from 'date-fns'

interface ErrorLogTableProps {
  errors: RobotError[]
}

const severityColors = {
  low: 'text-green-400',
  medium: 'text-yellow-400',
  high: 'text-[#FFD700]',
  critical: 'text-red-400'
}

export function ErrorLogTable({ errors }: ErrorLogTableProps) {
  const [sortField, setSortField] = useState<keyof RobotError>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterType, setFilterType] = useState<string>('all')
  const [filterSeverity, setFilterSeverity] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredErrors = errors.filter(error => {
    if (filterType !== 'all' && error.error_type !== filterType) return false
    if (filterSeverity !== 'all' && error.severity !== filterSeverity) return false
    if (filterStatus !== 'all') {
      const isResolved = error.resolved_at !== null
      if (filterStatus === 'resolved' && !isResolved) return false
      if (filterStatus === 'open' && isResolved) return false
    }
    if (searchQuery && !error.description.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const sortedErrors = [...filteredErrors].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const direction = sortDirection === 'asc' ? 1 : -1
    return aValue < bValue ? -direction : direction
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-10 bg-[#1C2333] rounded-md text-gray-300 text-sm border-0 focus:ring-1 focus:ring-blue-500 placeholder:text-gray-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-9 bg-[#1C2333] rounded-md text-gray-300 text-sm border-0 focus:ring-1 focus:ring-blue-500 px-3 appearance-none cursor-pointer min-w-[120px]"
        >
          <option value="all">All Types</option>
          <option value="software">Software</option>
          <option value="hardware">Hardware</option>
          <option value="connectivity">Connectivity</option>
          <option value="operational">Operational</option>
          <option value="system_error">System Error</option>
        </select>
        <select
          value={filterSeverity}
          onChange={(e) => setFilterSeverity(e.target.value)}
          className="h-9 bg-[#1C2333] rounded-md text-gray-300 text-sm border-0 focus:ring-1 focus:ring-blue-500 px-3 appearance-none cursor-pointer min-w-[120px]"
        >
          <option value="all">All Severities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 bg-[#1C2333] rounded-md text-gray-300 text-sm border-0 focus:ring-1 focus:ring-blue-500 px-3 appearance-none cursor-pointer min-w-[120px]"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="w-full">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th 
                onClick={() => {
                  if (sortField === 'created_at') {
                    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
                  } else {
                    setSortField('created_at')
                    setSortDirection('desc')
                  }
                }}
                className="text-left py-2 pr-6 text-gray-400 font-normal text-sm cursor-pointer hover:text-gray-300 transition-colors"
              >
                Time
              </th>
              <th className="text-left py-2 pr-6 text-gray-400 font-normal text-sm">Robot</th>
              <th className="text-left py-2 pr-6 text-gray-400 font-normal text-sm">Type</th>
              <th className="text-left py-2 pr-6 text-gray-400 font-normal text-sm">Severity</th>
              <th className="text-left py-2 pr-6 text-gray-400 font-normal text-sm">Description</th>
              <th className="text-left py-2 text-gray-400 font-normal text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedErrors.map((error) => (
              <tr 
                key={error.id}
                className="border-t border-gray-800/50 hover:bg-white/[0.02] transition-colors"
              >
                <td className="py-4 pr-6 font-mono text-sm text-gray-400">
                  {formatDistanceToNow(new Date(error.created_at), { addSuffix: true })}
                </td>
                <td className="py-4 pr-6 font-mono text-sm text-gray-300">
                  {error.robot_name || error.robot_id.slice(0, 8)}
                </td>
                <td className="py-4 pr-6 text-sm text-gray-300">
                  {error.error_type}
                </td>
                <td className="py-4 pr-6">
                  <span className={`text-sm ${severityColors[error.severity as keyof typeof severityColors]}`}>
                    {error.severity}
                  </span>
                </td>
                <td className="py-4 pr-6 text-sm text-gray-300">
                  {error.description}
                </td>
                <td className="py-4 text-sm">
                  <span className={error.resolved_at ? 'text-green-400' : 'text-red-400'}>
                    {error.resolved_at ? 'Resolved' : 'Open'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

