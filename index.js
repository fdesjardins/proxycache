'use strict';

const gcloud = require('google-cloud');
const Promise = require('bluebird');
const redis = require('redis');
const request = require('request');

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

class RedisLocalStore {
	constructor(connection, options) {
		this.options = options;
		this.client = redis.createClient();
	}

	get(key) {
		return this.client.getAsync(key).then(result => {
			if (result) {
				return result;
			}
			return null;
		});
	}

	set(key, value, ttl) {
		return this.redis.setAsync(key, value, 'EX', ttl);
	}
}

class GoogleCloudCache {
	constructor(config, localStore) {
		this.localStore = localStore;
		this.storage = gcloud.storage(config.connection);
		this.uploads = {};

		this.bucketName = config.options.bucket;
		this.bucket = this.storage.bucket(this.bucketName);
	}

	get(key) {
		return this.store.getAsync(key).then(result => {
			if (result) {
				return result;
			}
			return null;
		});
	}

	set(key, uri, ttl = 60) {
		return this._write(key, uri).then(cacheUri => {
			this.store.setAsync(key, cacheUri, 'EX', ttl);
			return cacheUri;
		});
	}

	_write(key, uri) {
		if (this.uploads[key] === undefined) {
			this.uploads[key] = true;
			const name = new Buffer(uri).toString('base64');
			const file = this.bucket.file(name);
			return new Promise((resolve, reject) => {
				request(uri)
					.pipe(file.createWriteStream())
					.on('error', err => {
						reject(err);
						delete this.uploads[key];
					})
					.on('finish', () => {
						resolve(`https://storage.googleapis.com/${this.bucketName}/${name}`);
						delete this.uploads[key];
					});
			});
		}
		return null;
	}
}

module.exports = (config = {}) => {
	if (!config.store || !config.cache) {
		throw new Error('invalid local or remote configuration');
	}

	let store;
	switch (config.store.client) {
		case 'redis':
			store = new RedisLocalStore(config.store);
			break;
		default:
			return Promise.reject(new Error('unknown store client type'));
	}

	let cache;
	if (config.cache.client === 'gcloud') {
		cache = new GoogleCloudCache(config.cache, store);
	} else {
		return Promise.reject(new Error('unknown cache client type'));
	}

	return Promise.resolve(cache);
};
