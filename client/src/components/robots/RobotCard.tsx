'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Robot } from '@/services/robotService'
import EditRobotStatusModal from './EditRobotStatusModal'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BatteryIcon, CalendarIcon, Trash2Icon, EditIcon } from 'lucide-react'

interface RobotCardProps {
  robot: Robot
  onDelete: (id: string) => void
  onUpdateStatus: (id: string, status: string, batteryLevel: number) => Promise<void>
  onClick: () => void
}

export default function RobotCard({ robot, onDelete, onUpdateStatus, onClick }: RobotCardProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const statusColors = {
    online: 'bg-green-500/10 text-green-500 border-green-500/50',
    offline: 'bg-red-500/10 text-red-500 border-red-500/50',
    maintenance: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50',
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card 
          className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-gray-600 transition-all cursor-pointer overflow-hidden"
          onClick={onClick}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold text-white">{robot.name}</CardTitle>
              <Badge variant="outline" className={`${statusColors[robot.status as keyof typeof statusColors]} capitalize`}>
                {robot.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center">
                <BatteryIcon className="w-4 h-4 mr-2" />
                Battery
              </span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-700 rounded-full mr-2 overflow-hidden">
                  <motion.div 
                    className="h-full bg-green-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${robot.battery_level}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <span className="text-gray-300">{robot.battery_level}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Last Active
              </span>
              <span className="text-gray-300">
                {new Date(robot.last_active).toLocaleString()}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex space-x-2">
            <Button 
              variant="outline" 
              className="flex-1 bg-blue-500/10 text-blue-400 border-blue-500/50 hover:bg-blue-500/20 hover:text-blue-300"
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
              className="flex-1 bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20 hover:text-red-300"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(robot.id)
              }}
            >
              <Trash2Icon className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <EditRobotStatusModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={async (status, batteryLevel) => {
          await onUpdateStatus(robot.id, status, batteryLevel)
        }}
        currentStatus={robot.status}
        currentBatteryLevel={robot.battery_level}
      />
    </>
  )
}

