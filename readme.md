# proxycache

[![Build Status](https://travis-ci.org/fdesjardins/proxycache.svg?branch=master)](https://travis-ci.org/fdesjardins/proxycache)
[![NPM Version](http://img.shields.io/npm/v/proxycache.svg?style=flat)](https://www.npmjs.org/package/proxycache)
[![Coverage Status](https://coveralls.io/repos/github/fdesjardins/proxycache/badge.svg?branch=master)](https://coveralls.io/github/fdesjardins/proxycache?branch=master)

A simple, configurable, Redis-powered caching proxy.

Use it when you want to
- deliver a URL to a static file
- cache the file somewhere
- provide a URL to the cached version for subsequent requests

# Install

```
$ npm install --save proxycache
```

# Example

See [./examples/simple.js](./examples/simple.js)

## API

### proxycache(options)

#### options

#####

Type: `object`

# License

MIT © [Forrest Desjardins](https://github.com/fdesjardins)
