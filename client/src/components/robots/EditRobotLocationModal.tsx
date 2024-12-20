'use client'

import { useState } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import Map, { Marker } from 'react-map-gl'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import 'mapbox-gl/dist/mapbox-gl.css'

interface Suggestion {
  place_name: string
  center: [number, number]
}

interface EditRobotLocationModalProps {
  isOpen: boolean
  onClose: () => void
  onUpdate: (latitude: number, longitude: number) => Promise<void>
  currentLocation: { latitude: number; longitude: number; } | null | undefined
}

export default function EditRobotLocationModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  currentLocation 
}: EditRobotLocationModalProps) {
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [location, setLocation] = useState(currentLocation || { latitude: 42.3601, longitude: -71.0589 })
  const [viewport, setViewport] = useState({
    latitude: currentLocation?.latitude || 42.3601,
    longitude: currentLocation?.longitude || -71.0589,
    zoom: 12
  })

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&types=place,address&limit=5`
      )
      const data = await response.json()
      
      if (data.features) {
        setSuggestions(data.features.map((feature: any) => ({
          place_name: feature.place_name,
          center: feature.center
        })))
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    handleSearch(value)
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setLocation({
      latitude: suggestion.center[1],
      longitude: suggestion.center[0]
    })
    setViewport({
      ...viewport,
      latitude: suggestion.center[1],
      longitude: suggestion.center[0],
      zoom: 14
    })
    setSuggestions([])
    setSearchQuery(suggestion.place_name)
  }

  const handleMapClick = (event: any) => {
    setLocation({
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await onUpdate(location.latitude, location.longitude)
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Update Robot Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <input
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder="Search for a location..."
              className="w-full px-3 py-2 bg-background border rounded-md"
            />
            {searchLoading && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin" />
            )}
            
            {suggestions.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-background border rounded-md shadow-lg">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    className="w-full px-4 py-2 text-sm text-left hover:bg-muted flex items-center gap-2"
                    onClick={() => handleSuggestionClick(suggestion)}
                  >
                    <MapPin className="h-4 w-4" />
                    <span>{suggestion.place_name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="h-[300px] rounded-md overflow-hidden border">
            <Map
              {...viewport}
              mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/dark-v11"
              onClick={handleMapClick}
              onMove={evt => setViewport(evt.viewState)}
            >
              <Marker
                latitude={location.latitude}
                longitude={location.longitude}
                anchor="bottom"
              >
                <MapPin className="h-6 w-6 text-primary" />
              </Marker>
            </Map>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Location'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 