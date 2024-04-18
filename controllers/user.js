////////////////////////////////////////////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////////////////////////////////////////////////////////////////////////
const express = require("express")
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const { Cookie } = require("express-session")


////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTER
////////////////////////////////////////////////////////////////////////////////////////////////////
const router = express.Router()


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
            await User.create(req.body)
        res.send("signup successful")
    } catch(error){
        console.log("----", error, "----")
        res.status(400).send("error, read logs for details");
    }
})

// Login Page Route - Get (/user/login) -> form
router.get("/login", (req, res) => {
    res.send("this is the signup page")
})

// Login Submit Route - Post (/user/login) -> login user
router.post("/login", async (req, res) => {
    try{
        //get the username and password from req.body
        const {email, password} = req.body
        //search the database for the user
        const user = await User.findOne({email})
        // check if the user exists
        if (!user){
            throw new Error("User Error: User Doesn't Exist")
        }
        // check if the password matches
        const result = await bcrypt.compare(password, user.password)
        // check the result of the match
        if(!result){
            throw new Error("User Error: Password Doesn't Match")
        }
        
        // save that user is logged in in req.session
        req.session.email = email
        req.session.loggedIn = true

        // send them back to fruits
        res.send("logged in")
    }catch(error){
        console.log("----", error.message, "----")
        res.status(400).send("error, read logs for details");
    }
})

// Logout Route - ??? -> destroy the session
router.get("/logout", async (req, res) => {
    req.session.destroy((err) => {
        res.send("you are logged out")
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////
// EXPORT ROUTER
////////////////////////////////////////////////////////////////////////////////////////////////////
module.exports = router