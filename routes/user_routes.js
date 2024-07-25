const express = require("express")

const { addUser, userlogin, allUsers, getUser, updateUser, updatePassword, deleteUser, deleteUserById } = require("../controllers/user_controller")

const checkJwt = require(`../middleware/jwt`)
const checkAdmin = require(`../middleware/jwt2`)

const userRoutes = express.Router()

userRoutes.post('/create', addUser)

userRoutes.post('/login', userlogin)

userRoutes.get('/all', checkAdmin, allUsers)

userRoutes.get('/get/:name', checkAdmin, getUser)

userRoutes.put('/update/:name', checkJwt, updateUser)

userRoutes.put('/updatePassword/:name', checkJwt, updatePassword)

userRoutes.delete('/delete/:name', checkAdmin, deleteUser)

userRoutes.delete('/:id/delete', checkAdmin, deleteUserById)


module.exports = userRoutes