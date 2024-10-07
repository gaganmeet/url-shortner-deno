const kv = await Deno.openKv()

export interface Link {
  slug: string
  destination: string
}

export async function getLink(slug: string): Promise<Link | null> {
  if (!slug) {
    throw new Error('Slug is required')
  }
  const res = await kv.get(['links', slug])

  if (res.value) {
    const l: Link = res.value as Link
    return l
  }
  return null
}

export async function createLink(
  slug: string,
  destination: string
): Promise<Link> {
  if (!slug || !destination) {
    throw new Error('Slug and destination are required')
  }
  const key = ['links', slug]
  const value: Link = { slug, destination }

  const res = await kv
    .atomic()
    .check({ key, versionstamp: null })
    .set(key, value)
    .commit()

  if (res.ok) {
    return value
  }
  throw new Error('Failed to create link')
}
