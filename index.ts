import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

fastify.get('/todo', function (request, reply) {
  reply.send({ hello: 'world' })
})

fastify.listen({ port: 3000 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  } else {
    console.log(`Server listening at ${address}`)
  }
})
