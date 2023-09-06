const app = require('./app')

app.listen(3000, () => {
  console.log("Server running. Use our API on port: 3000")
})

    // "start": "cross-env NODE_ENV=production node ./server.js",
    // "start:dev": "cross-env NODE_ENV=development nodemon ./server.js",