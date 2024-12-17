'use client';
import { useEffect, useState } from 'react';
import { Battery, Wifi } from 'lucide-react';

interface Robot {
  id: string;
  serialNumber: string;
  status: string;
  batteryLevel: number;
}

export default function DashboardPage() {
  const [robots, setRobots] = useState<Robot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRobots = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/robots', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setRobots(data);
        }
      } catch (error) {
        console.error('Failed to fetch robots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRobots();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FFD700]"></div>
    </div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {robots.map((robot) => (
        <div 
          key={robot.id} 
          className="bg-[#1A1A1A] overflow-hidden shadow-lg rounded-sm border border-neutral-800 transition-all duration-200 hover:border-[#FFD700]"
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-[#FFD700]">
              Robot {robot.serialNumber}
            </h3>
            <div className="mt-3 space-y-2">
              <p className="text-sm text-neutral-400 flex items-center">
                <Wifi className="mr-2 h-4 w-4" />
                Status: <span className="ml-1 text-white">{robot.status}</span>
              </p>
              <p className="text-sm text-neutral-400 flex items-center">
                <Battery className="mr-2 h-4 w-4" />
                Battery: <span className="ml-1 text-white">{robot.batteryLevel}%</span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

