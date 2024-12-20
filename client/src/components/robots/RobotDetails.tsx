import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Wifi, Activity, Clock } from 'lucide-react';

interface RobotDetailsProps {
  robot: {
    id: string;
    name: string;
    status: string;
    battery_level: number;
    connection_strength?: number;
    last_active: string;
    model?: string;
    serial_number?: string;
    current_activity?: string;
  };
}

export function RobotDetails({ robot }: RobotDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{robot.name}</h1>
          <p className="text-gray-500">Model: {robot.model} | SN: {robot.serial_number}</p>
        </div>
        <div className="flex space-x-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            robot.status === 'active' ? 'bg-green-100 text-green-800' :
            robot.status === 'idle' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {robot.status}
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Battery Level</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{robot.battery_level}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection</CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{robot.connection_strength}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Active</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(robot.last_active).toLocaleTimeString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {robot.current_activity || 'Idle'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 