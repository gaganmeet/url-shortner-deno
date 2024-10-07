import { Application, Router } from '@oak/oak'
import { Link, getLink, createLink } from './db.ts'

const app = new Application()
const api = new Router()

api.get('/:slug', async (ctx) => {
  const slug = ctx.params.slug
  const link: Link = await getLink(slug)
  if (link) {
    ctx.response.status = 200
    ctx.response.body = { location: link.destination }
  } else {
    ctx.response.status = 404
    ctx.response.body = { error: 'Link not found' }
  }
})

api.post('/create', async (ctx) => {
  const l: Link = await ctx.request.body.json()
  const link: Link = await createLink(l.slug, l.destination)
  ctx.response.body = link
})

app.use(api.routes())
app.use(api.allowedMethods())

await app.listen({ port: 8000 })
