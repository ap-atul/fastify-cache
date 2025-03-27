import Fastify from 'fastify'
import cachePlugin from './plugin'
import { MyCacheService } from './service'

const fastify = Fastify()
fastify.register(cachePlugin(new MyCacheService()))

fastify.get('/todo', function (request, reply) {
  reply.send({ hello: 'world' })
})

fastify.get('/todo/cached', { config: { cache: { ttl: 100 } } }, function (request, reply) {
  console.log('SENDING NORMAL RESPONSE')
  reply.send({ hello: 'world from cache' })
})

fastify.listen({ port: 3000 }, () => console.log("server started"))
