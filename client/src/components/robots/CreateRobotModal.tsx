'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BotIcon as RobotIcon, Loader2Icon } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

interface CreateRobotModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}

export default function CreateRobotModal({ isOpen, onClose, onCreate }: CreateRobotModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Robot name is required')
      return
    }

    try {
      setLoading(true)
      setError('')
      console.log('Submitting robot name:', name)
      await onCreate(name)
      setName('')
      onClose()
    } catch (err) {
      console.error('Error in modal:', err)
      setError(err instanceof Error ? err.message : 'Failed to create robot')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-gray-900 to-gray-800 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <RobotIcon className="w-6 h-6 text-blue-400" />
            Add New Robot
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-300">
              Robot Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter robot name"
              disabled={loading}
            />
            {error && (
              <p className="text-sm text-red-400">{error}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="text-gray-300 hover:text-white hover:bg-gray-700"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Robot'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

