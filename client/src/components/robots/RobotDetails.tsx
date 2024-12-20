import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Wifi, Activity, Clock, MapPin } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import EditRobotLocationModal from './EditRobotLocationModal';
import { robotService } from "@/services/robotService";
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
    location?: {
      latitude: number;
      longitude: number;
    };
  };
}

export function RobotDetails({ robot }: RobotDetailsProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [location, setLocation] = useState<{latitude: number; longitude: number} | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const locationData = await robotService.getRobotLocation(robot.id);

        console.log('Location data:', locationData);
        if (locationData.length > 0) {
          setLocation({
            latitude: locationData[0].latitude,
            longitude: locationData[0].longitude
          });
        }
        else {
          setLocation(null);
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      }
    };

    fetchLocation();
  }, [robot.id]);

  const handleLocationUpdate = async (latitude: number, longitude: number) => {
    try {
      await robotService.updateRobotLocation(robot.id, latitude, longitude);
      setLocation({ latitude, longitude }); // Update local state
      toast({
        title: 'Location updated successfully',
        variant: 'default',
      });
    } catch (error) {
      console.error('Error updating location:', error);
      toast({
        title: 'Failed to update location',
        variant: 'destructive',
      });
    }
  };

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

      {location && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Location</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] rounded-md overflow-hidden">
              <Map
                initialViewState={{
                  longitude: location.longitude,
                  latitude: location.latitude,
                  zoom: 14
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              >
                <Marker
                  longitude={location.longitude}
                  latitude={location.latitude}
                  anchor="bottom"
                >
                  <div className={`w-4 h-4 rounded-full ${
                    robot.status === 'online' ? 'bg-green-500' :
                    robot.status === 'offline' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                </Marker>
              </Map>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Coordinates: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Robot Location</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                {location ? (
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                    </span>
                    <span className="text-sm text-muted-foreground">Current Coordinates</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">Location Not Set</span>
                )}
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsLocationModalOpen(true)}
              className="flex items-center gap-2"
            >
              {location ? 'Update Location' : 'Set Location'}
            </Button>
          </div>
        </CardContent>
      </Card>

      

      <EditRobotLocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onUpdate={handleLocationUpdate}
        currentLocation={location}
      />
    </div>
  );
}

