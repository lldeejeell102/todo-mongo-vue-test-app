const mongoose = require('./connection')

const {Schema, model} = mongoose

const todoSchema = new Schema ({
    name: String,
    description: String,
    email: String
}, {timestamps: true})

const Todo = model("Todo", todoSchema)

module.exports = Todo