require('express-async-errors')

const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')

const router = require('./controllers/restaurants')

mongoose.connect(config.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    logger.info('connected to mongoDB')
  })
  .catch(err => {
    logger.error('failed to connect to mongoDB: ', err.message)
  })

const app = express()
app.use(cors())
app.use(express.json())

app.use(middleware.tokenExtractor)

app.use('/', router)
if('test' === process.env.NODE_ENV) {
  const testRouter = require('./src/controllers/test')
  app.use('/api/testing', testRouter)
}

app.use(middleware.requestLogger)
app.use(middleware.errorHandler)

module.exports = app