import { Navigate, useParams } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'

const LEGACY_PROJECT_SLUGS: Record<string, string> = {
  'personal-portal': 'personal-portal',
}

export default function LegacyProjectRedirect() {
  const { id } = useParams()
  const slug = id ? LEGACY_PROJECT_SLUGS[id] : undefined

  return slug
    ? <Navigate replace to={`/vault/${slug}`} />
    : <NotFoundPage />
}
