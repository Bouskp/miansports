import { categories } from '@/lib/utils'
import { getPostsPaginated } from '@/lib/wordpress'
import { toCard, type PostCard } from '@/lib/utils'

const FIELDS = 'id,slug,date,title,excerpt,focal_point,_embedded'

// Index de toutes les catégories (parents + sous-sports) par slug.
const BY_SLUG = new Map(
  categories.flatMap((c) => [c, ...(c.children ?? [])]).map((c) => [c.slug, c]),
)

// IDs à interroger : la catégorie elle-même + toutes ses sous-catégories.
// (Les rubriques parentes n'ont pas d'article propre : tout est dans les enfants.)
function categoryIds(slug: string): number[] {
  const cat = BY_SLUG.get(slug)
  if (!cat) return []
  return [cat.id, ...(cat.children ?? []).map((c) => c.id)]
}

export async function getLatestCards(n: number): Promise<PostCard[]> {
  const { data } = await getPostsPaginated(1, n, { fields: FIELDS })
  return data.map(toCard)
}

export async function getCardsByCategory(
  slug: string,
  n: number,
): Promise<PostCard[]> {
  const ids = categoryIds(slug)
  if (ids.length === 0) return []
  const { data } = await getPostsPaginated(1, n, {
    // WordPress accepte une liste d'IDs séparés par des virgules (OU logique).
    category: ids.join(','),
    fields: FIELDS,
  })
  return data.map(toCard)
}

// Une page d'une catégorie (pour /categorie/[slug]).
// `hasNext` est déduit du nombre d'articles reçus : une page pleine peut
// avoir une page suivante.
export async function getCategoryPage(
  slug: string,
  page: number,
  perPage: number,
): Promise<{ posts: PostCard[]; hasNext: boolean }> {
  const ids = categoryIds(slug)
  if (ids.length === 0) return { posts: [], hasNext: false }
  try {
    const { data } = await getPostsPaginated(page, perPage, {
      category: ids.join(','),
      fields: FIELDS,
    })
    return { posts: data.map(toCard), hasNext: data.length === perPage }
  } catch {
    // WordPress renvoie une erreur 400 quand la page demandée dépasse la dernière.
    return { posts: [], hasNext: false }
  }
}
