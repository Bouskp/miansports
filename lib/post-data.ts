import { cache } from 'react'

import { toCard, type PostCard } from '@/lib/utils'
import { getPostBySlug as fetchPostBySlug } from '@/lib/wordpress'

// Forme brute d'un article de l'API REST WordPress (seulement ce qu'on utilise).
export type RawPost = {
  id: number
  slug: string
  date: string
  modified?: string
  content: { rendered: string }
  categories?: number[]
  _embedded?: {
    author?: { name?: string }[]
  }
}

export type FullPost = { raw: RawPost; card: PostCard }

// Un article complet (contenu inclus) à partir de son slug.
// `cache` évite un 2e appel WordPress entre generateMetadata et la page.
export const getPostBySlug = cache(
  async (slug: string): Promise<FullPost | null> => {
    const post = await fetchPostBySlug(slug)
    // Garde : ne jamais afficher un autre article que celui demandé.
    if (!post || (post as unknown as RawPost).slug !== slug) return null
    return { raw: post as unknown as RawPost, card: toCard(post) }
  },
)
