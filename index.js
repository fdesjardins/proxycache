const gcs = require('@google-cloud/storage')
const Promise = require('bluebird')
const redis = require('redis')
const request = require('superagent')

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

class RedisLocalStore {
  constructor (config, options) {
    this.options = options
    this.client = redis.createClient(config.connection)
  }

  get (key) {
    return this.client.getAsync(key).then(result => {
      if (result) {
        return result
      }
      return null
    })
  }
  // TTL in seconds
  set (key, value, ttl = 60) {
    this.client.setAsync(key, value, 'EX', ttl)
  }
}

class GoogleCloudCache {
  constructor (config, localStore) {
    this.store = localStore
    this.storage = gcs(config.connection)
    this.uploads = {}

    this.bucketName = config.options.bucket
    this.bucket = this.storage.bucket(this.bucketName)
  }

  get (key) {
    return this.store.get(key).then(result => {
      if (result) {
        return result
      }
      return null
    })
  }

  set (key, uri, ttl = 60) {
    return this._write(key, uri).then(cacheUri => {
      this.store.set(key, cacheUri, ttl)
      return cacheUri
    })
  }

  _write (key, uri) {
    if (this.uploads[key] === undefined) {
      this.uploads[key] = true
      const name = Buffer.from(uri).toString('base64')
      const file = this.bucket.file(name)
      return new Promise((resolve, reject) => {
        request.get(uri)
          .pipe(file.createWriteStream())
          .on('error', err => reject(err))
          .on('finish', () => resolve())
      })
      .then(() => `https://storage.googleapis.com/${this.bucketName}/${name}`)
      .finally(() => {
        delete this.uploads[key]
      })
    }
    return null
  }
}

module.exports = (config = {}) => {
  if (!config.store || !config.cache) {
    throw new Error('invalid local or remote configuration')
  }

  let store
  switch (config.store.client) {
    case 'redis':
      store = new RedisLocalStore(config.store)
      break
    default:
      return Promise.reject(new Error('unknown store client type'))
  }

  let cache
  if (config.cache.client === 'gcloud') {
    cache = new GoogleCloudCache(config.cache, store)
  } else {
    return Promise.reject(new Error('unknown cache client type'))
  }

  return Promise.resolve(cache)
}
