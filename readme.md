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

```javascript
const express = require('express');
const request = require('request');
const proxycache = require('proxycache');

// Create Redis/Cloud Storage proxycache client
const config = {
	store: {
		client: 'redis',
		connection: {}
	},
	cache: {
		client: 'gcloud',
		connection: {
			keyFilename: './gcloud-key.json',
			projectId: 'my-project-id'
		},
		options: {
			bucket: 'images'
		}
	}
};
let cache;
proxycache(config).then(client => {
	cache = client;
});

// Image server to proxy for
const imgsrv = express();
imgsrv.get('/images/:id', (req, res) => {
	const id = req.params.id;
	request.get(`http://www.fillmurray.com/g/${id}/${id}`).pipe(res);
});
imgsrv.listen(3888);
console.log('Image server listening on 3888');

const render = src => `
<html>
	<head>
		<title>bfm</title>
	</head>
	<body>
		<img src='${src}' height=500 width=500/>
	</body>
</html>
`;

// API Server
const app = express();
app.get('/images/:id', (req, res) => {
	const id = req.params.id;
	// query the cache
	cache.get(id).then(result => {
		// cache hit
		if (result) {
			return res.end(render(result));
		}
		const uri = `http://localhost:3888/images/${id}`;
		// cache miss; send the default url
		res.end(render(uri));
		// cache the file
		cache.set(id, uri, 60);
	});
});
app.listen(8000);
console.log('API server listening on 8000');
```

## API

### proxycache(options)

#### options

#####

Type: `object`

# License

MIT © [Forrest Desjardins](https://github.com/fdesjardins)
