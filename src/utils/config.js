require('dotenv').config()

const PORT = 8000
const MONGO_URI = 'mongodb://127.0.0.1:27017/restaurants'

module.exports = {
  PORT,
  MONGO_URI
}