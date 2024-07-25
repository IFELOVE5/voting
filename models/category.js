
const mongoose = require(`mongoose`)
const Candidate = require('./candidate.js')

const Schema = mongoose.Schema

const categorySchema = new Schema ({
    Position:{
        type: String,
        required: true,
        lowercase: true
    },

    candidate:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    },

},
{timestamps: true}
)

categorySchema.virtual(`id`).get(function(){
    return this._id.toHexString()
})
categorySchema.set( `toJSON`, {virtuals:true,
    
})

const categoryModel = mongoose.model("Category", categorySchema)
module.exports = categoryModel
