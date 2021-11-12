const router = require('express').Router();
const User = require('../models/User')
const bcrypt = require('bcrypt')


//REGISTER

router.post("/Register",async (req,res)=>{
    
    try{
        // generate the salt of the pwd
        const salt = await bcrypt.genSalt(10)
        // hash the pwd
        const hashedPwd = await bcrypt.hash(req.body.password , salt) 
        // create the new user
        const user= await new User({
            username :req.body.username,
            email :req.body.email,
            password: hashedPwd,
        })
        // save the user
        const NewUser = await user.save()
        //respond
        res.status(200).json(NewUser)
    }catch(err){
        console.log(err)
    }
    
})
//LogIn


router.post("/Login" , async(req, res)=>{
    try{
        const user  = await User.findOne({ email :  req.body.email });
        !user && res.status(404).json('User not found ');
        const validPwd = await bcrypt.compare( req.body.password , user.password)
        !validPwd && res.status(400).json('wrong password')
    
        res.status(200).json(user)
    } catch(err) {
        console.log(err)
    }
    
})






module.exports= router