import { useEffect } from 'react'
import { Link } from 'react-router'
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/utils'

export type CityMapPin = {
  id: string
  name: string
  latitude: number
  longitude: number
  href?: string
  color?: string
  subtitle?: string
}

type Origin = {
  latitude: number
  longitude: number
  label?: string
}

type CityMapProps = {
  pins: CityMapPin[]
  origin?: Origin
  radiusKm?: number
  className?: string
  zoom?: number
}

function pinIcon(color: string, you = false) {
  return L.divIcon({
    className: you ? 'city-pin you-pin' : 'city-pin',
    html: `<span style="background:${color}"></span>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11],
    popupAnchor: [0, -12],
  })
}

function Recenter({
  pins,
  origin,
}: {
  pins: CityMapPin[]
  origin?: Origin
}) {
  const map = useMap()
  const signature = [
    origin ? `${origin.latitude},${origin.longitude}` : '',
    ...pins.map((p) => `${p.id}:${p.latitude}:${p.longitude}`),
  ].join('|')

  useEffect(() => {
    const points: [number, number][] = pins.map((p) => [p.latitude, p.longitude])
    if (origin) points.push([origin.latitude, origin.longitude])

    if (points.length === 0) {
      map.setView([-8.838, 13.234], 12)
    } else if (points.length === 1) {
      map.setView(points[0], 15)
    } else {
      map.fitBounds(points, { padding: [48, 48], maxZoom: 15 })
    }

    const timer = window.setTimeout(() => map.invalidateSize(), 80)
    return () => window.clearTimeout(timer)
  }, [map, signature, origin, pins])

  return null
}

export function CityMap({
  pins,
  origin,
  radiusKm,
  className,
  zoom = 13,
}: CityMapProps) {
  const center: [number, number] = origin
    ? [origin.latitude, origin.longitude]
    : pins[0]
      ? [pins[0].latitude, pins[0].longitude]
      : [-8.838, 13.234]

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[2rem] border border-border shadow-sm',
        className,
      )}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        className="z-0 h-full min-h-[240px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <Recenter pins={pins} origin={origin} />

        {origin && radiusKm != null && (
          <Circle
            center={[origin.latitude, origin.longitude]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#14B8A6',
              weight: 1,
              fillColor: '#14B8A6',
              fillOpacity: 0.08,
            }}
          />
        )}

        {origin && (
          <Marker
            position={[origin.latitude, origin.longitude]}
            icon={pinIcon('#14B8A6', true)}
          >
            <Popup>
              <p className="m-0 text-sm font-medium">
                {origin.label ?? 'Estás aqui'}
              </p>
            </Popup>
          </Marker>
        )}

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={pinIcon(pin.color ?? '#FF5C4D')}
          >
            <Popup>
              {pin.href ? (
                <Link to={pin.href} className="font-medium text-primary no-underline">
                  {pin.name}
                </Link>
              ) : (
                <p className="m-0 font-medium">{pin.name}</p>
              )}
              {pin.subtitle && (
                <p className="m-0 mt-0.5 text-xs text-muted-foreground">{pin.subtitle}</p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export function mapsDirUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
