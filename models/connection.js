require('dotenv').config()
const mongoose = require('mongoose')

const DATABASE_URL = process.env.DATABASE_URL
mongoose.connect(DATABASE_URL)

mongoose.connection
.on("open", () => {console.log('You are connected to Mongo')})
.on("close", () => {console.log('You are disconnected from Mongo')})
.on("error", (error) => {console.log(error)})


module.exports = mongoose