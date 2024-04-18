const express = require('express')
const Todo = require('../models/Todo')
const verifyJWT = require('../utils/middleware')

const router = express.Router()


// MIDDLEWARE
// Checking to see if you're logged in
router.use(verifyJWT)

// ROUTES
router.get('/protected', verifyJWT, async (req, res, Todo) => {
    try {
        const userId = req.user.id;
        const todos = await Todo.find({ userId });

        res.json({ message: "Welcome, " + req.user.name, todos });
    } catch (error) {
        console.log("---", error.message, "----");
        res.status(400).send('error, read logs for details');
    }
});

// New - Get
// router.get("/new", (req, res) => {
//     res.send("here's the new todo")
// })

// Create - Post
router.post('/', async (req, res) => {
    try {
        const userId = req.user.id;
        req.body.userId = userId;

        const createdTodo = await Todo.create(req.body);
        res.json({ message: 'Todo created successfully', todo: createdTodo });
    } catch (error) {
        console.log("---", error.message, "----");
        res.status(400).send('error, read logs for details');
    }
});


// Edit - Get
router.get("/:id/edit", async (req, res) => {
    try{
        const id = req.params.id
        const todo = await Todo.findById(id)
        res.render("edit page", {todo})
    } catch(error) {
        console.log("----", error.message, "----")
        res.status(400).send("error, read logs for details")
    }
})

// Update - Put
router.put("/:id", verifyJWT, async (req, res) => {
    try{
        const id = req.params.id
        await Todo.findByIdAndUpdate(id, req.body)
        res.send('updated')
    } catch(error) {
        console.log("----", error.message, "----")
        res.status(400).send("error, read logs for details")
    }
})

// Delete - Delete
// router.delete("/:id", async (req, res) => {
//     const id = req.params.id
//     await Todo.findByIdAndDelete(id)
//     res.send("deleted")
// })

// Show - Get
router.get('/:id', verifyJWT, async (req, res) => {
    try {
        const id = req.params.id;
        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).send('Todo not found');
        }

        res.json({ todo });
    } catch (error) {
        console.log("---", error.message, "----");
        res.status(400).send('error, read logs for details');
    }
});



// Exports router
module.exports = router