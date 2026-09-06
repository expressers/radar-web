const WEEKDAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

export function formatPrice(min?: number | null, max?: number | null) {
  if (min == null && max == null) return 'Entrada livre'
  const fmt = (n: number) =>
    `${new Intl.NumberFormat('pt-PT').format(n)} Kz`
  if (min != null && max != null && min !== max) return `${fmt(min)} – ${fmt(max)}`
  return fmt(min ?? max ?? 0)
}

export function formatDistance(meters: number) {
  if (meters < 950) return `${Math.round(meters)} m`
  const km = meters / 1000
  return `${km.toFixed(km < 10 ? 1 : 0).replace('.', ',')} km`
}

export function formatWhen(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const sameDay =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()

  const time = date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (sameDay) return `hoje às ${time}`

  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const isTomorrow =
    date.getFullYear() === tomorrow.getFullYear() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getDate() === tomorrow.getDate()

  if (isTomorrow) return `amanhã às ${time}`

  const weekday = WEEKDAYS[date.getDay()]
  const day = date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
  return `${weekday}, ${day} às ${time}`
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function greeting(now = new Date()) {
  const h = now.getHours()
  const weekday = WEEKDAYS[now.getDay()]
  if (h < 6) {
    return {
      kicker: 'Ainda é noite',
      title: 'A cidade não dormiu.',
      line: 'Há sítios abertos e gente a sair. Vê o que está perto.',
    }
  }
  if (h < 12) {
    return {
      kicker: `Bom dia · ${weekday}`,
      title: 'O que podes fazer hoje?',
      line: 'Brunch, um filme, um sítio novo. A cidade já acordou.',
    }
  }
  if (h < 17) {
    return {
      kicker: `Boa tarde · ${weekday}`,
      title: 'Ainda dá para sair.',
      line: 'O que está a acontecer daqui a pouco, à tua volta.',
    }
  }
  if (h < 21) {
    return {
      kicker: `O pôr-do-sol · ${weekday}`,
      title: 'A noite está a começar.',
      line: 'Onde ir, com quem, e o que está a acontecer perto de ti.',
    }
  }
  return {
    kicker: `Boa noite · ${weekday}`,
    title: 'Onde é que a cidade está viva?',
    line: 'Karaoke, mesa, palco, ecrã. As pessoas já saíram.',
  }
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('')
}

export function formatAgo(iso: string, now = new Date()) {
  const date = new Date(iso)
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
  if (seconds < 20) return 'agora'
  if (seconds < 60) return `há ${Math.max(seconds, 1)}s`
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `há ${minutes} min`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `há ${hours} h`
  const days = Math.round(hours / 24)
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  return date.toLocaleDateString('pt-PT', { day: 'numeric', month: 'short' })
}
