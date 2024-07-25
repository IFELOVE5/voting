
const mongoose = require(`mongoose`)

const Schema = mongoose.Schema

const userSchema = new Schema ({
    name:{
        type: String,
        required: true
    },

    email: {
       type: String,
       required: true,
       lowercase:true
    },

    password: {
        type: String,
        required: true
    },

    isAdmin: {
        type: Boolean,
        default: false
    }
 
},

{timestamps: true})


userSchema.virtual(`id`).get( function(){
    return this._id.toHexString()
})
userSchema.set( `toJSON`, { virtuals:true }
)

const userModel = mongoose.model("User", userSchema)

module.exports = userModel
