export interface Robot {
  id: string;
  name: string;
  status: 'online' | 'offline' | 'maintenance';
  battery_level: number;
  last_active: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}
