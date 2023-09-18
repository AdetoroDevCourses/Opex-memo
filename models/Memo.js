const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)

const memoSchema = new mongoose.Schema(
    {
        user: {
            type:mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        text: {
            type: String,
            requires: true,
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
)

memoSchema.plugin(AutoIncrement, {
    inc_field: 'memo',
    id: 'memoNums',
    start_seq: 100
})

module.exports = mongoose.model("Memo", memoSchema)