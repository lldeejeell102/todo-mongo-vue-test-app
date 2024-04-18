////////////////////////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require("express")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const verifyJWT = require("../utils/middleware")
const jwt = require('jsonwebtoken')


////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTER
////////////////////////////////////////////////////////////////////////////////////////////////////
const router = express.Router()
router.get('/protected', verifyJWT, async (req, res, Todo) => {
    try{
        const userId = req.user.id;
        const todos = await Todo.find({ userId })
        res.json({message: "Welcome, " + req.user.name, todos})
    }catch(error){
        console.log("---", error.message, "---")
        res.status(400).send('error, read logs for details')
    }
})


////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTES
////////////////////////////////////////////////////////////////////////////////////////////////////

// Signup Page Route - Get (/user/signup) -> form
router.get("/signup", (req, res) => {
    console.log("this is the signup page")
    res.send("this is the signup page res.send")
})

// Signup Submit Route - Post (/user/signup) -> create user
router.post("/signup", async (req, res) => {
    try{
        // encrypt the password
        req.body.password = await bcrypt.hash(
                req.body.password, 
                
                // encrypts the password using a 10 multiplier
                await bcrypt.genSalt(10)
            )
            console.log("Hashed Password:", req.body.password)
            
            // create the user
            const createdUser = await User.create(req.body)
        res.json({message: "Signup sucessful", user: createdUser})
    } catch(error){
        console.log("----", error, "----")
        res.status(400).send("error, read logs for details");
    }
})

// Login Page Route - Get (/user/login) -> form
router.get("/login", (req, res) => {
    res.send("this is the login page")
})

// Login Submit Route - Post (/user/login) -> login user
router.post("/login", async (req, res) => {
    try{
        
        console.log(req.body)

        //get the username and password from req.body
        const {email, password} = req.body
        //search the database for the user
        const user = await User.findOne({email})
        // check if the user exists
        if (!user){
            throw new Error("User Error: User Doesn't Exist")
        }
        console.log("email is a match")
        // check if the password matches
        const result = await bcrypt.compare(password, user.password)
        // check the result of the match
        if(!result){
            throw new Error("User Error: Password Doesn't Match")
        }
        console.log("password is a match")
        
        // Assuming the user object has an "id" and "username" field
        const token = jwt.sign({ user: { id: user.id, email: user.email } }, process.env.JWT_SECRET, { expiresIn: '30m' });

        
        res.json({message: "you've successfully logged in", user: user})
    }catch(error){
        console.log("----", error.message, "----")
        res.status(400).send("error, read logs for details");
    }
})

// Logout Route - ??? -> destroy the session
router.get("/logout", async (req, res) => {
    res.json({message: "you are logged out"})
})

////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT ROUTER
////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router