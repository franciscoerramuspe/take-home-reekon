'use client';

import { useEffect, useState } from 'react';
import { ErrorLogTable } from '@/components/errors/ErrorLogTable';
import { errorService } from '@/services/errorService';
import { RobotError } from '@/types/robotErrors';
import { useCustomToast } from '@/hooks/useCustomToast';

export default function ErrorLogPage() {
  const [errors, setErrors] = useState<RobotError[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useCustomToast();

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        const data = await errorService.listErrors();
        setErrors(data);
      } catch (error) {
        console.error('Error fetching error logs:', error);
        toast.error('Failed to load error logs');
      } finally {
        setLoading(false);
      }
    };

    fetchErrors();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Error Logs</h1>
      <ErrorLogTable errors={errors} />
    </div>
  );
} 