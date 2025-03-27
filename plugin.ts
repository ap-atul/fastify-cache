import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions,
  FastifyReply,
  FastifyRequest,
  RequestPayload
} from 'fastify'
import fp from 'fastify-plugin'
import _ from 'lodash'

interface CacheService {
  get(key: string): Promise<any | null>
  set(key: string, value: any, options: { ttl: string }): Promise<void>
}

const isCacheableRequest = (request: FastifyRequest) => {
  if (
    request.method !== 'GET' ||
    request.headers['cache-control'] === 'no-cache' ||
    request.headers['x-cache-bypass'] === 'true' ||
    _.isNil(_.get(request.routeOptions.config, 'cache'))
  ) {
    return false
  }
  return true
}

const isCacheableResponse = (reply: FastifyReply, payload: RequestPayload) => {
  if (
    reply.statusCode !== 200 ||
    reply.getHeader('x-cache') === 'hit' ||
    reply.request.method !== 'GET' ||
    _.isNil(_.get(reply.request.routeOptions.config, 'cache')) ||
    _.isEmpty(payload)
  ) {
    return false
  }
  return true
}

const cacheOnRequestHook = (service: CacheService) => async (request: FastifyRequest, reply: FastifyReply) => {
  if (!isCacheableRequest(request)) {
    return
  }
  const cacheKey = request.url
  const cacheData = await service.get(cacheKey)
  if (_.isNil(cacheData)) {
    return
  }
  reply.header('x-cache', 'hit').status(200).send(cacheData)
}

const cacheOnSendHook =
  (service: CacheService) => async (request: FastifyRequest, reply: FastifyReply, payload: RequestPayload) => {
    if (!isCacheableResponse(reply, payload)) {
      return payload
    }
    const cacheKey = request.url
  }

const plugin = (service: CacheService) => async (server: FastifyInstance, options: FastifyPluginOptions) => {
  server.addHook('onRequest', cacheOnRequestHook(service))
  server.addHook('onSend', cacheOnSendHook(service))
}

const cachePlugin = (service: CacheService): FastifyPluginAsync =>
  fp(plugin(service), {
    name: 'fastify-cache',
    fastify: '5.x'
  })

export default cachePlugin
