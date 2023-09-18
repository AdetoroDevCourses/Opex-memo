const User = require('../models/User')
const Memo = require('../models/Memo')
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');


const getAllMemo = asyncHandler( async (req, res) => {
    const memo = await Memo.find().lean()
    if(!memo?.length){
        return res.status(400).json({message: "No Memo find"})
    }

    const memosWithUser = await Promise.all(memo.map(async (memo) => {
        const user = await User.findById(memo.user).lean().exec()
        return {...memo, username: user.username}
    }))

    res.json(memosWithUser)
})

const createMemo = asyncHandler(async (req, res) => {
    const {user, title, text }=  req.body
    if(!user || !title || !text){
        return res.status(400).json({message: "All field are required"})
    }
    const duplicate = await Memo.findOne({title}).lean().exec()
    if(duplicate){
        return res.status(400).json({message: "Duplicate memo"})
    }
    const memo = await Memo.create({user, title, text})
    if(memo){
        return res.status(201).json({message: "New memo created"})
    }else{
        return res.status(400).json({message: "Invalid memo data received"})
    }
})

const updateMemo = asyncHandler(async (req, res) => {
    const {id, user, title, text, completed} = req.body
    if (id || user || title || text || typeof completed != "boolean"){
        return res.status(400).json({message: "All fields are required"})
    }

    const memo = await Memo.findById(id).exec()

    if(!memo){
        return res.status(400).json({message: "Memo not found"})
    }

    const  duplicate = await Memo.findOne({title}).lean().exec()
    if(duplicate && duplicate?._id.toString() != id){
        return res.status(409).json({message: "Duplicate username"})
    }
    memo.user = user
    memo.title = title
    memo.text = text
    memo.completed = completed
    const updatedmemo = await memo.save()
    res.status({message: `${updatedmemo.title} updated`})
})

const deleteMemo = asyncHandler(async (req, res) => {
    const {id} = req.body
    if(!id) {
        return res.status(400).json({message: "Memo ID required"})
    }

    const memo = await Memo.findById(id).exec()
     
    if(!memo){
        return res.status(400).json({message: "Memo not found"})
    }
    const result = await memo.deleteOne()

    const reply = `Userdname ${result.title} with ID ${result._id} has been deleted`
    res.json(reply)
})

module.exports = {
    getAllMemo,
    createMemo,
    updateMemo,
    deleteMemo
}