// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { timingSafeEqual } from 'crypto'

export async function POST(req: Request) {
  const given = Buffer.from(req.headers.get('x-secret') ?? '')
  const expected = Buffer.from(process.env.REVALIDATE_SECRET!)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return Response.json({ ok: false }, { status: 401 })
  }

  const { slug, old_slug } = await req.json()
  if (slug) revalidatePath(`/articles/${slug}`)
  if (old_slug && old_slug !== slug) revalidatePath(`/blog/${old_slug}`)
  revalidatePath('/')
  revalidateTag('posts', 'max') // articles list
  return Response.json({ ok: true })
}
