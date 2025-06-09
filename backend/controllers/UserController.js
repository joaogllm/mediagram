const User = require("../models/User")

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { default: mongoose } = require("mongoose");
const jwtSecret = process.env.JWT_SECRET

// Generate user Token
const generateToken = (id)=> {
    return jwt.sign({id}, jwtSecret, {expiresIn: "7d"})
}

// Register user and sign in
const register  = async (req,res)=>{
    const {name, email, password} = req.body 

    //check if user exists
    const user = await User.findOne({email})
    if(user){
        res.status(422).json({errors: ["Por favor, utilize outro e-mail"]})
    }

    // generate password hash
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)

    //Create user
    const newUser = await User.create({
        name,
        email,
        password: passwordHash
    })

    // if user was create succesfully, return the token
    if(!newUser){
        res.status(422).json({errors: ["Houve um error, porfavor tente mais tarde"]})
        return 
    }
    res.status(201).json({
        _id: newUser._id,
        token: generateToken(newUser._id)
    })
}

// Sign user in
const login = async (req,res)=>{
    const {email, password} = req.body
    const user = await User.findOne({email})

    //check if user exists
    if(!user){
        res.status(404).json({errors: ["Usuario nao encontrado!"]})
        return
    }

    // check if password matches
    if(!(await bcrypt.compare(password, user.password))){
        res.status(422).json({errors: ["Senha invalida"]})
        return
    }

    // return user with token
    res.status(201).json({
        _id: user._id,
        profileImage: user.profileImage,
        token: generateToken(user.id)
    })
}


const getCurrentUser = async (req,res) =>{
    const user = req.user

    res.status(200).json(user)
}

// update an user
const update = async(req,res)=>{
    const {name, password, bio} = req.body
    let profileImage = null
    if(req.file){
        profileImage = req.file.filename
    }

    const reqUser = req.user

    const user = await User.findById(new mongoose.Types.ObjectId(reqUser._id)).select(
    "-password"
    );

    if(name){
        user.name = name
    }

    if(password){
            // generate password hash
        const salt = await bcrypt.genSalt()
        const passwordHash = await bcrypt.hash(password, salt)

        user.password = passwordHash
    }

    if(profileImage){
        user.profileImage = profileImage
    }

    if(bio){
        user.bio = bio
    }

    await user.save()
    res.status(200).json(user)
}

// Get User by id
const getUserById = async (req,res)=> {
    const {id} = req.params

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(id)).select("-password")
        // check if user exists
    if(!user){
        res.status(404).json({errors: ["Usuario nao encontrado"]})
        return;
    }

    res.status(200).json(user)
    } catch (error) {
        res.status(404).json({errors: ["Usuario nao encontrado"]})        
    }
}

module.exports = {
    register,
    login,
    getCurrentUser,
    update,
    getUserById

}