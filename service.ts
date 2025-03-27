import { CacheService } from './plugin'
export class MyCacheService implements CacheService {
  private cache: Map<string, any> = new Map()

  async get(key: string): Promise<string> {
    console.log(this.cache)
    console.log('READING FROM CACHE')
    return this.cache.get(key)
  }

  async set(key: string, value: any, { ttl }: { ttl: number }): Promise<void> {
    console.log('SETTING CACHE', ttl)
    console.log(key, value)
    this.cache.set(key, value)
  }
}
