const configuredApiUrl = import.meta.env.VITE_API_URL?.trim()

export const appConfig = {
  apiUrl: configuredApiUrl || '/graphql',
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'Radar',
}
