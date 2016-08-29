# proxy-cache

[![Build Status](https://travis-ci.org/fdesjardins/proxy-cache.svg?branch=master)](https://travis-ci.org/fdesjardins/proxy-cache)
[![NPM Version](http://img.shields.io/npm/v/proxy-cache.svg?style=flat)](https://www.npmjs.org/package/proxy-cache)
[![Coverage Status](https://coveralls.io/repos/github/fdesjardins/proxy-cache/badge.svg?branch=master)](https://coveralls.io/github/fdesjardins/proxy-cache?branch=master)

A simple, configurable, Redis-powered caching proxy.

Use it when you want to
- deliver a URL to a static file
- cache the file somewhere
- provide a URL to the cached version for subsequent requests

# Install

```
$ npm install --save proxy-cache
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
