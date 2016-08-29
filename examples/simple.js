const express = require('express');
const request = require('request');
const proxycache = require('./')

// create gcloud proxy cache client
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
}
const cache = proxycache(config)

// downstream service
const getDownstreamUrl = (id) => {
  return Promise.resolve(`http://localhost:3888/images/${id}`)
}

// image server
const imgsrv = express()
imgsrv.get('/images/:id', (req, res) => {
  const id = req.params.id
  request.get(`http://www.fillmurray.com/g/${id}/${id}`).pipe(res)
})
imgsrv.listen(3888)
console.log('imgsrv listening on 3888')

const template = (src) => `
<html>
	<head>
		<title>bfm</title>
	</head>
	<body>
		<img src='${src}' height=500 width=500/>
	</body>
</html>
`

// api server
const app = express()
app.get('/images/:id', (req, res) => {
  const id = req.params.id
  cache.get(id).then(result => {
    // cache hit
    if (result) {
      return res.end(template(result))
    }
    // cache miss
    getDownstreamUrl(id).then(url => {
      // send the default url
      res.end(template(url))
      // tell proxy-cache to cache the file
      cache.set(id, url, 60)
    })
  })
})
app.listen(8000)
console.log('app listening on 8000')
