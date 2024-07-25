const mongoose = require (`mongoose`)
const Schema = mongoose.Schema

const voteSchema = new Schema ({

    category: {
        type: String,
        required: true
    },

    candidate: {
        type: String,
        required: true
    },

    Voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `User`,
        required: true
    }
 },

 {timestamps: true}

)

const voteModel = mongoose.model("Vote", voteSchema)
module.exports = voteModel