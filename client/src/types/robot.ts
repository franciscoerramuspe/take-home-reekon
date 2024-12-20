export interface Robot {
  id: string;
  name: string;
  organization_id: string;
  status: 'online' | 'offline' | 'maintenance';
  battery_level: number;
  last_active: string;
  created_at: string;
  updated_at: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  model?: string;
  serial_number?: string;
  current_activity?: string;
  connection_strength?: number;
}
