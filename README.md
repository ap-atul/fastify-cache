# fastify-cache

A Fastify plugin to integrate data caching for routes.

## Description

`fastify-cache` is a plugin for the Fastify framework that provides a simple and flexible way to add caching to your
routes. It allows you to cache responses for specific routes, improving performance and reducing the load on your
backend services. The plugin is designed to be extensible, enabling you to use any caching service of your choice by
implementing a simple interface.

## Features

- **Route-specific caching**: Cache responses for specific routes by adding a `config.cache` option in the route
  configuration.
- **Customizable TTL (Time-to-Live)**: Specify the TTL for cached responses on a per-route basis.
- **Pluggable cache service**: Use any caching service (e.g., Redis, in-memory cache, etc.) by implementing the required
  `CacheService` interface.
- **Cache control**: Automatically bypass caching for requests with `Cache-Control: no-cache` or `X-Cache-Bypass: true`
  headers.
- **Cache hit detection**: Responses served from the cache include an `X-Cache: hit` header.

## Installation

Just get the `plugin.ts` file

## Route Configuration

To enable caching for a specific route, add the config.cache option to the route configuration:

- Enable caching: Set config.cache to true to enable caching for the route with the default TTL of 600 seconds (10
  minutes).
- Custom TTL: Set config.cache.ttl to specify a custom TTL (in seconds) for the cached response. Example:

```javascript
fastify.get('/example', { config: { cache: true } }, async (request, reply) => {
  return { data: 'This response is cached for 10 minutes by default' }
})

fastify.get('/example/custom-ttl', { config: { cache: { ttl: 300 } } }, async (request, reply) => {
  return { data: 'This response is cached for 5 minutes' }
})
```

## Cache Service Dependency

The fastify-cache plugin requires a cache service to handle the storage and retrieval of cached data. The cache service
must implement the following interface:

```typescript
interface CacheService {
  get(key: string): Promise<any | null>
  set(key: string, value: any, options: { ttl: number }): Promise<void>
}
```

You can implement this interface to use any caching backend, such as Redis, Memcached, or an in-memory store.

You can then use this service with the plugin:

```javascript
const cacheService = new InMemoryCacheService()
fastify.register(cachePlugin(cacheService))
```

## Cache Bypass

The plugin automatically bypasses caching for requests with the following headers:

- `Cache-Control: no-cache`
- `X-Cache-Bypass: true`

This ensures that clients can request fresh data when needed.

## Cache Hit Detection

Responses served from the cache include an X-Cache: hit header, allowing clients to determine whether the response was
retrieved from the cache.

## Hooks The plugin uses the following Fastify hooks:

- `onRequest`: Checks if the request is cacheable and serves the cached response if available.
- `onSend`: Caches the response payload if the response is cacheable.

## Limitations

- Only GET requests are cacheable.
- Responses with a status code other than 200 are not cached.
- Empty responses are not cached.
