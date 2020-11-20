import express from 'express'
import { makeExpressHandlers } from '../flows/sextant-express.generated.js'

const app = express()

const handlers = makeExpressHandlers('frontend', 'server', {
  props: {
    add: (request, response) => {
      console.log('add', request.query)
      response.sendStatus(200)
    },
    update: (request, response) => {
      console.log('update')
      response.sendStatus(200)
    },
    remove: (request, response) => {
      console.log('remove')
      response.sendStatus(200)
    },
  },
})

handlers.forEach(({ feature, handler }) => {
  Object.entries(handler).forEach(([scenario, callback]) => {
    app.post(`/${feature}/${scenario}`, callback)
  })
})

app.get('/', (request, response) => {
  response.send('HELLO WORLD')
})

app.listen(4000)

// import fs from 'fs'
// import http from 'http'

// http
//   .createServer((request, response) => {
//     const { host } = request.headers
//     let body = []
//     if (host.startsWith('http://localhost') || host.startsWith('localhost')) {
//       request
//         .on('error', (err) => {
//           console.error(err)
//         })
//         .on('data', (chunk) => {
//           body.push(chunk)
//         })
//         .on('end', () => {
//           const bodyString = JSON.stringify(Buffer.concat(body).toString())

//           response.on('error', (err) => {
//             console.error(err)
//           })
//           console.log(request.headers)
//           response.writeHead(200, {
//             // 'Access-Control-Allow-Origin': request.headers.origin,
//             'Access-Control-Allow-Methods': 'POST',
//             'Access-Control-Allow-Headers': 'Content-Type',
//             'Content-Type': 'application/json',
//           })

//           fs.writeFileSync('data.json', bodyString)

//           response.end(bodyString)
//         })
//     } else {
//       response.writeHead(403)
//       response.end()
//     }
//   })
//   .listen(8080)
