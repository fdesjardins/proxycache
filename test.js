/* global describe, it */

const assert = require('chai').assert
const proxycache = require('./')

describe('proxycache', () => {
  it('should throw without options', done => {
    assert.throws(proxycache)
    done()
  })

  it('should throw with local store config', done => {
    const config = {
      cache: {
        connection: {}
      }
    }
    assert.throws(() => proxycache(config))
    done()
  })

  it('should not initialize with unknown store client name', done => {
    const config = {
      store: {
        client: 'unknown',
        connection: {}
      },
      cache: {
        client: 'gcloud',
        connection: {}
      }
    }
    proxycache(config).catch(() => done())
  })

  it('should not initialize with unknown cache client name', done => {
    const config = {
      store: {
        client: 'redis',
        connection: {}
      },
      cache: {
        client: 'unknown',
        connection: {}
      }
    }
    proxycache(config).catch(() => done())
  })
})
