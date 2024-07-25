const mongoose = require(`mongoose`)

const User = require(`../models/user`)

const argon2 = require(`argon2`)

const jwt= require(`jsonwebtoken`)

exports.addUser = async(req, res, next) => {
    const {name, email, password} = req.body
    if (!name || !email || !password ) {
        return res.status(400).json({
            status: false,
            message: "All fields are required"})       
    
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
        return res.status(400).json({message: `invalid email format`})
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (!passwordRegex.test(password)) {
        return res.status(400).json({message: `Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one special character.`})
    }


    try {
        
    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({
            status: false,
            message: "User already exists, kindly login"})
    }

        
    const existingUser2 = await User.findOne({ name })
    if (existingUser2) {
        return res.status(400).json({
            status: false,
            message: "name already exists, kindly use another name"})
    }

  const hashedPassword = await argon2.hash(password)

  const user = new User ({
    email,
    name,
    password: hashedPassword
  })

  const savedUser = await user.save()

  const newUser = {
    name: savedUser.name,
    id: savedUser.id,
    email: savedUser.email,
  }

  
  if (newUser) {
    const token = jwt.sign({
        id: savedUser.id,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin
    },
     process.env.JWT_KEY,

     {expiresIn: 8640})


    return res.status(201).json({
        status: true,
        message:"New User created succesfully",
        newUser,
        token: token,
    })}

    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
}

exports.userlogin = async (req, res, next) => {
    const {email, password} = req.body
    if (!email || !password ) {
        return res.status(400).json({
            status: false,
            message: "All fields are required to login"})       
    }

    try {
        const existingUser = await User.findOne({email})
        if (!existingUser) {
            return res.status(404).json({
                status: false,
                message: "User account doesn't exist, kindly sign up"})   
        }        

        const verifiedPassword = await argon2.verify(existingUser.password, password)
        if (!verifiedPassword) {
            return res.status(404).json({
                status: false,
                message: "incorrect password, authentication failed"}) 
        }

      if (existingUser && verifiedPassword) {
        const token = jwt.sign({
            id: existingUser.id,
            email: existingUser.email,
            isAdmin: existingUser.isAdmin
        },
         process.env.JWT_KEY,

         {expiresIn: 8640}
    
         )

         return res.status(200).json({
            status: true,
            message: `user login succesful, welcome ${existingUser.name}`,
            token: token,
            expiresIn: 86400
        })  
        
      }
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
}

exports.allUsers = async (req, res, next) => {
    
    try {

        const users = await User.find()
        const count = await User.countDocuments()

        if (!users || users.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No users found"})  
        }

        return res.status(200).json({
            status: true,
            message: `Total number of users ${count}`,
            users
        })

    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }
}

 exports.getUser = async (req, res, next) => {
    const name = req.params.name
    if (!name) { return res.status(400).json({
        status: false,
        message: "name parameter is required "})  
    }

    try {
        const user = await User.findOne({name}).select('name email')
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "The user doesn't exist"})  
        }

        return res.status(200).json({
            status: true,
            message: `User found`,
            user
        })

        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       })
    }


},

exports.updateUser = async(req, res, next) => {

    const {name} = req.params
    const {newName, email} = req.body

 
    try {

        if (!newName) {
            return res.status(404).json({
                status: false,
                message: "Please provide a new name to update"})
            
        }
        const existingName = await User.findOne({name: newName})
        if (existingName) {
            return res.status(404).json({
                status: false,
                message: "Name already exists, kindly use another name"})
        }

        const user = await User.findOneAndUpdate({name}, {name:newName, email}, {new:true})


        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found or unable to update user"})
        }

        updatedUser = {
            name: user.name,
            id: user.id,
            email: user.email,
            dateupdated: user.updatedAt
        }

        return res.status(200).json({
            status: true,
            message: `User updated successfully`,
            updatedUser
        })
        
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       }) 
    }


}

exports.updatePassword = async (req, res, next) => {
    const {name} = req.params
    const {newPassword} = req.body

    try {
        hashedPassword = await argon2.hash(newPassword)
        const existingUser = await User.findOne({name})
        const existingPassword = await argon2.verify(existingUser.password, newPassword)
        if (existingPassword) {
            return res.status(404).json({
                status: false,
                message: "Old password and new Password can't be the same, kindly use a different password"})
        }

    
        const user = await User.findOneAndUpdate({name}, {password:hashedPassword}, {new:true}) 

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found or unable to update user"})  
        }
        
        return res.status(200).json({
            status: true,
            message: `Password updated successfully`
        })
        
        
    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       }) 
    }
},

exports.deleteUser = async(req, res, next) => {
    const {name} = req.params

    try {
        
        const user = await User.findOneAndDelete({name})
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found or unable to update user"})  
        }

        return res.status(200).json({
            status: true,
            message: `User deleted successfully`
        })
        

    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       }) 
    }
}

exports.deleteUserById = async(req, res, next) => {
    const {id} = req.params

    try {
        if (!mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                status: false,
                message: "invalid Id format"})  
            
        }

        const idCheck = await User.findById(id)
        if (!idCheck) {
            return res.status(404).json({
                status: false,
                message: "Id doesn't exist"})  
            
        }
        
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found or unable to delete user"})  
        }

        return res.status(200).json({
            status: true,
            message: `User deleted successfully`
        })
        

    } catch (error) {
        console.error(error); 
        return res.status(500).json({
        message: `An internal error occured`
       }) 
    }
}