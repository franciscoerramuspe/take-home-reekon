import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, XCircle } from 'lucide-react'

export function useCustomToast() {
  const { toast } = useToast()

  return {
    success: (message: string) => {
      toast({
        title: 'Success',
        description: message,
        variant: 'default',
        className: 'bg-gradient-to-r from-green-500 to-green-600 text-white border-none',
        duration: 3000,
        icon: <CheckCircle className="h-5 w-5" />,
      })
    },
    error: (message: string) => {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
        className: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-none',
        duration: 3000,
        icon: <XCircle className="h-5 w-5" />,
      })
    },
  }
}
