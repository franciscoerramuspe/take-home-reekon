'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EditIcon, Trash2Icon, BotIcon, BatteryIcon } from 'lucide-react'
import EditRobotStatusModal from './EditRobotStatusModal'
import type { Robot } from '@/types/robot'

interface RobotCardProps {
  robot: Robot
  onDelete: (id: string) => Promise<void>
  onUpdateStatus: (id: string, status: string, batteryLevel: number) => Promise<void>
  onClick: () => void
}

export default function RobotCard({ robot, onDelete, onUpdateStatus, onClick }: RobotCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleting(true)
    try {
      await onDelete(robot.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        onClick={onClick}
        className="cursor-pointer bg-gray-800/50 hover:bg-gray-800/70 border-gray-700 transition-all duration-200"
      >
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BotIcon className="w-5 h-5" />
            <span>{robot.name}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Status</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                robot.status === 'online' ? 'bg-green-500/20 text-green-400' :
                robot.status === 'offline' ? 'bg-red-500/20 text-red-400' :
                'bg-yellow-500/20 text-yellow-400'
              }`}>
                {robot.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Battery</span>
              <div className="flex items-center space-x-2">
                <BatteryIcon className={`w-4 h-4 ${
                  robot.battery_level > 70 ? 'text-green-400' :
                  robot.battery_level > 30 ? 'text-yellow-400' :
                  'text-red-400'
                }`} />
                <span>{robot.battery_level}%</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <Button 
            variant="outline" 
            className="w-full sm:w-auto flex-1 bg-blue-500/10 text-blue-400 border-blue-500/50 hover:bg-blue-500/20 hover:text-blue-300"
            onClick={(e) => {
              e.stopPropagation()
              setIsEditModalOpen(true)
            }}
          >
            <EditIcon className="w-4 h-4 mr-2" />
            Edit Status
          </Button>
          <Button 
            variant="outline"
            className="w-full sm:w-auto flex-1 bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20 hover:text-red-300"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2Icon className={`w-4 h-4 mr-2 ${isDeleting ? 'animate-spin' : ''}`} />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </CardFooter>
      </Card>

      <EditRobotStatusModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={async (status, batteryLevel) => {
          await onUpdateStatus(robot.id, status, batteryLevel)
          setIsEditModalOpen(false)
        }}
        currentStatus={robot.status}
        currentBatteryLevel={robot.battery_level}
      />
    </motion.div>
  )
}

