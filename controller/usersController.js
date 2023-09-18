const User = require('../models/User')
const Memo = require('../models/Memo')
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');



const getAllUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find().select('-password').lean()
    if(!users?.length){
        return res.status(400).json({message: "No users found"})
    }
    res.json(users)
})


const createNewUser = asyncHandler(async (req, res, next) => {
    const { username, password, roles} = req.body
    if(!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({message: "All fields are required"})
    }

    const duplicate = await User.findOne({ username }).lean().exec()
    if(duplicate){
        return res.status(409).json({ message: "Username already exist"})
    }

    const hashedPsswd = await bcrypt.hash(password, 10)
    const userObject = {username, "password": hashedPsswd, roles}
    const user = await User.create(userObject)
    if(user){
        res.status(201).json({message: `New user ${username} created`})
    } else {
        res.status(400).json({message: "Invalid user data received"})
    }
})

const updateUser = asyncHandler(async (req, res) => {
    const {id, username, roles, active, password} = req.body
    if(!id || !username || !password || !Array.isArray(roles) || !roles.length || typeof active != 'boolean') {
        return res.status(400).json({message: "All fields except password are required"})
    }
    const user = await user.findById(id).exec()

    if(!user){
        return res.status(400).json({message: "User not found"})
    }

    const duplicate = await User.findOne({username}).lean().exec()

    if(duplicate && duplicate?._id.toString() != id){
        return res.status(409).json({message: "Duplicate username"})
    }
    user.username = username
    user.roles = roles
    user.active = active
    if(password){
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.status({message: `${updatedUser.username} updated`})
        
})

const deleteUser = asyncHandler(async (req, res) => {
    const {id} = req.body
    if(!id){
        return res.status(400).json({message: "user Id required"})
    }
    const memo = await Memo.findOne({ user: id}).lean().exec()
    if(memo){
        return res.status(400).json({message: "User has assigned memo"})
    }

    const user =  await User.findById(id).exec()
    if(!user){
        return res.status(400).json({message: "User not found"})
    }
    const result = await user.deleteOne()
    const reply = `Userdname ${result.username} with ID ${result._id} has been deleted`
    res.json(reply)
})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}