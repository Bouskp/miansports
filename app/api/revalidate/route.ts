// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { timingSafeEqual } from 'crypto'

export async function POST(req: Request) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) return Response.json({ ok: false }, { status: 500 })

  const given = Buffer.from(req.headers.get('x-secret') ?? '')
  const expected = Buffer.from(secret)
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return Response.json({ ok: false }, { status: 401 })
  }

  const { slug, old_slug } = await req.json()
  if (slug) revalidatePath(`/blog/${slug}`)
  if (old_slug && old_slug !== slug) revalidatePath(`/blog/${old_slug}`)
  revalidatePath('/')
  revalidateTag('posts', 'max')
  revalidateTag('wordpress', 'max')
  revalidateTag('categories', 'max')
  return Response.json({ ok: true })
}
