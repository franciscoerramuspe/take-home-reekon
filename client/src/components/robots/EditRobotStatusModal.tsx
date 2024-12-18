'use client'

import { useState, useEffect } from 'react'
import { BotIcon, BatteryIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EditRobotStatusModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (status: string, batteryLevel: number) => Promise<void>
  currentStatus: string
  currentBatteryLevel: number
}

export default function EditRobotStatusModal({
  isOpen,
  onClose,
  onUpdate,
  currentStatus,
  currentBatteryLevel,
}: EditRobotStatusModalProps) {
  const [status, setStatus] = useState(currentStatus)
  const [batteryLevel, setBatteryLevel] = useState(currentBatteryLevel)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setStatus(currentStatus)
      setBatteryLevel(currentBatteryLevel)
    }
  }, [isOpen, currentStatus, currentBatteryLevel])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onUpdate(status, batteryLevel)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 rounded-lg w-[400px]"
      >
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center">
            <BotIcon className="w-6 h-6 mr-2" />
            Update Robot Status
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <div className="relative">
                <BotIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Battery Level
              </label>
              <div className="relative">
                <BatteryIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={batteryLevel}
                  onChange={(e) => setBatteryLevel(Number(e.target.value))}
                  min="0"
                  max="100"
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  %
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full border-gray-600 hover:bg-gray-700"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Status'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

