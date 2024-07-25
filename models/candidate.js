
const mongoose = require(`mongoose`)
const Category = require(`./category`)
const Schema = mongoose.Schema

const candidateSchema = new Schema ({
    name:{
        type: String,
        required: true
    },
    picture: {
        type: String,
       required: true
    },

    party: {
        type: String,
        required: true
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Category'
         
    }
},
{timestamps: true}
)

candidateSchema.virtual(`id`).get(function(){
    return this._id.toHexString()
})
candidateSchema.set( `toJSON`, {virtuals:true
})

const candidateModel = mongoose.model("Candidate", candidateSchema)
module.exports = candidateModel
