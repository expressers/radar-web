import { createBrowserRouter, RouterProvider } from 'react-router'
import { AuthProvider } from '@/hooks/use-auth'
import { Shell } from '@/components/layout/shell'
import { HomePage } from '@/pages/home'
import { NearbyPage } from '@/pages/nearby'
import { LocalPage } from '@/pages/local'
import { EventPage } from '@/pages/event'
import { ArticlePage } from '@/pages/article'
import { PeoplePage } from '@/pages/people'
import { PersonPage } from '@/pages/person'
import { SavedPage } from '@/pages/saved'
import { MePage } from '@/pages/me'
import { LoginPage, RegisterPage } from '@/pages/auth'
import { OrganizationPage } from '@/pages/organization'
import { ExplorePage } from '@/pages/explore'
import { NotFoundPage } from '@/pages/not-found'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Shell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'explorar', element: <ExplorePage /> },
      { path: 'perto', element: <NearbyPage /> },
      { path: 'sitios/:slug', element: <LocalPage /> },
      { path: 'acontece/:slug', element: <EventPage /> },
      { path: 'leituras/:slug', element: <ArticlePage /> },
      { path: 'pessoas', element: <PeoplePage /> },
      { path: 'u/:username', element: <PersonPage /> },
      { path: 'guardados', element: <SavedPage /> },
      { path: 'eu', element: <MePage /> },
      { path: 'entrar', element: <LoginPage /> },
      { path: 'criar', element: <RegisterPage /> },
      { path: 'casas/:slug', element: <OrganizationPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
