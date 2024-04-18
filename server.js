const express = require('express')
require('dotenv').config()
const bodyParser = require('body-parser')
const userRouter = require('./controllers/user')
const Todo = require('./models/Todo')
const todoRouter = require('./controllers/todo')
const cors = require('cors')


const mongoose = require('./models/connection')



const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/user', userRouter)
app.use('/todo', todoRouter)
app.get('/', (req, res) => {
    res.send("your server is running... better catch it")
})

const PORT = process.env.PORT || 4321
app.listen(PORT, () => console.log(`now listening on port ${PORT}`))