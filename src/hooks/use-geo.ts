import { useCallback, useState } from 'react'
export type GeoState = {
  latitude: number | null
  longitude: number | null
  source: 'device' | 'none'
  pending: boolean
  denied: boolean
}

export function useGeo() {
  const [state, setState] = useState<GeoState>({
    latitude: null,
    longitude: null,
    source: 'none',
    pending: false,
    denied: false,
  })

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        source: 'none',
        pending: false,
        denied: true,
      })
      return
    }

    setState((prev) => ({ ...prev, pending: true }))
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          source: 'device',
          pending: false,
          denied: false,
        })
      },
      () => {
        setState({
          latitude: null,
          longitude: null,
          source: 'none',
          pending: false,
          denied: true,
        })
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    )
  }, [])

  return { ...state, locate }
}
