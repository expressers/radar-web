import { useCallback, useState } from 'react'
import { TALATONA } from '@/lib/theme'

export type GeoState = {
  latitude: number
  longitude: number
  source: 'device' | 'fallback'
  pending: boolean
  denied: boolean
}

export function useGeo() {
  const [state, setState] = useState<GeoState>({
    ...TALATONA,
    source: 'fallback',
    pending: false,
    denied: false,
  })

  const locate = useCallback(() => {
    if (!navigator.geolocation) {
      setState({
        ...TALATONA,
        source: 'fallback',
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
          ...TALATONA,
          source: 'fallback',
          pending: false,
          denied: true,
        })
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60_000 },
    )
  }, [])

  return { ...state, locate }
}
