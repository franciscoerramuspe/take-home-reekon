'use client'

import { useState, useRef, useEffect } from 'react'
import { BotIcon as RobotIcon, Loader2, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { toast } from '@/hooks/use-toast'
import Map, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Suggestion {
  place_name: string
  center: [number, number]
}

interface CreateRobotModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (name: string, location: { latitude: number; longitude: number }) => Promise<void>
}

export default function CreateRobotModal({ isOpen, onClose, onCreate }: CreateRobotModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [viewport, setViewport] = useState({
    latitude: 42.3601,
    longitude: -71.0589,
    zoom: 11,
    bearing: 0,
    pitch: 0
  })
  const searchTimeoutRef = useRef<NodeJS.Timeout>()
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Clear suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
      console.error('Error fetching suggestions:', error)
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value)
    }, 300) // Debounce by 300ms
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const [lng, lat] = suggestion.center
    setLocation({ latitude: lat, longitude: lng })
    setViewport({
      ...viewport,
      latitude: lat,
      longitude: lng,
      zoom: 14
    })
    setSearchQuery(suggestion.place_name)
    setSuggestions([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Please enter a robot name",
        variant: "destructive",
      })
      return
    }
    if (!location) {
      toast({
        title: "Error",
        description: "Please select a location for the robot",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await onCreate(name, location)
      setName('')
      setLocation(null)
      onClose()
    } catch (error) {
      console.error('Error creating robot:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMapClick = (event: any) => {
    setLocation({
      latitude: event.lngLat.lat,
      longitude: event.lngLat.lng
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RobotIcon className="h-5 w-5" />
            Create New Robot
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
          <div className="space-y-2">
            <Label htmlFor="name">Robot Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter robot name"
              disabled={loading}
            />
          </div>

          <div className="space-y-2 flex-1 flex flex-col">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Initial Location
            </Label>
            
            <div className="relative">
              <div className="flex gap-2 mb-2">
                <Input
                  value={searchQuery}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  placeholder="Search for a location..."
                />
                {searchLoading && (
                  <div className="absolute right-3 top-2.5">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </div>
              
              {suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute z-10 mt-1 w-full bg-card border border-input rounded-md shadow-lg"
                >
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      type="button"
                      className="w-full px-4 py-2 text-sm text-left hover:bg-muted transition-colors flex items-center gap-2"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{suggestion.place_name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex-1 rounded-md overflow-hidden border border-input">
              <Map
                {...viewport}
                mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                onClick={handleMapClick}
                onMove={evt => setViewport(evt.viewState)}
              >
                {location && (
                  <Marker
                    latitude={location.latitude}
                    longitude={location.longitude}
                    anchor="bottom"
                  >
                    <MapPin className="h-6 w-6 text-primary" />
                  </Marker>
                )}
              </Map>
            </div>
            {location && (
              <p className="text-xs text-muted-foreground">
                Selected: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Robot'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

