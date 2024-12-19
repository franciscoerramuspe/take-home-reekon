'use client'

import Map, { Marker, Popup } from 'react-map-gl'
import { useState } from 'react'
import { BotIcon, BatteryIcon } from 'lucide-react'
import 'mapbox-gl/dist/mapbox-gl.css'

// Add custom CSS to override Mapbox popup styles
import './RobotMap.css'

interface Robot {
  id: string
  name: string
  status: string
  location: {
    latitude: number
    longitude: number
  }
  battery_level: number
}

interface RobotMapProps {
  robots: Robot[]
}

export default function RobotMap({ robots }: RobotMapProps) {
  const [popupInfo, setPopupInfo] = useState<Robot | null>(null)

  return (
    <Map
      initialViewState={{
        longitude: -71.0589,
        latitude: 42.3601,
        zoom: 12
      }}
      style={{ width: '100%', height: 500 }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      {robots.map((robot) => (
        <Marker
          key={robot.id}
          longitude={robot.location.longitude}
          latitude={robot.location.latitude}
          onClick={e => {
            e.originalEvent.stopPropagation()
            setPopupInfo(robot)
          }}
        >
          <div className={`w-4 h-4 rounded-full ${
            robot.status === 'online' ? 'bg-green-500' :
            robot.status === 'offline' ? 'bg-red-500' :
            'bg-yellow-500'
          }`} />
        </Marker>
      ))}

      {popupInfo && (
        <Popup
          longitude={popupInfo.location.longitude}
          latitude={popupInfo.location.latitude}
          anchor="bottom"
          onClose={() => setPopupInfo(null)}
          className="robot-popup"
        >
          <div className="p-4 min-w-[200px]">
            <div className="flex items-center space-x-2 mb-4">
              <BotIcon className="w-5 h-5" />
              <h3 className="font-bold">{popupInfo.name}</h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  popupInfo.status === 'online' ? 'bg-green-500/20 text-green-400' :
                  popupInfo.status === 'offline' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {popupInfo.status}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Battery</span>
                <div className="flex items-center space-x-2">
                  <BatteryIcon className={`w-4 h-4 ${
                    popupInfo.battery_level > 70 ? 'text-green-400' :
                    popupInfo.battery_level > 30 ? 'text-yellow-400' :
                    'text-red-400'
                  }`} />
                  <span>{popupInfo.battery_level}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Location</span>
                <span className="text-xs">
                  {popupInfo.location.latitude.toFixed(4)}, {popupInfo.location.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        </Popup>
      )}
    </Map>
  )
} 