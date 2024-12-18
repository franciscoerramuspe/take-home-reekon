import { useToast } from './use-toast';

export function useCustomToast() {
  const { toast } = useToast();

  return {
    success: (message: string) => {
      toast({
        title: 'Success',
        description: message,
        variant: 'default',
        className: 'bg-green-500 text-white border-none',
      });
    },
    error: (message: string) => {
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  };
}
