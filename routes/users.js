var User = require("../models/User")
var router = require('express').Router();
const bcrypt = require('bcrypt')


router.get("/" ,async(req,res)=>{
    //res.send('hi am the user route')
   const users =  await User.find({});
    res.json(users)

})


//Update a user 
router.put("/:id" ,async(req,res)=>{
    //si l'id existe
    
    if(req.body.userId === req.params.id || req.body.isAdmin){
        
        //in case of Password updaing 
        if(req.body.password){
        try{
            const salt = await bcrypt.genSalt(10)
            req.body.password = await bcrypt.hash(req.body.password , salt)

        }catch(err){
            res.status(500).json(err)
        }
    }
        //updat the user 
        try{
            //Search the user by ID Then 
            //remplace the old user data with the data of the request 
            const user = await User.findByIdAndUpdate(req.body.userId,{
                $set: req.body})
                return res.status(200).json("Done")
            }catch(err){
                return res.status(500).json(err)
            }     
    }else{
        return res.status(404).json('User unfound')
    }
})

//delete user 
router.delete("/:id" ,async(req,res)=>{
    //si l'id existe
    if(req.body.userId === req.params.id || req.body.isAdmin){

        //delete the user 
        try{
            //Search the user by ID Then 
            //delete it
            await User.deleteOne({_id:req.params.id})
            return res.status(200).send("Done")
            }catch(err){
                return res.status(500).json(err)
            }     
    }else{
        return res.status(404).json('User unfound')
    }
})

//get all users 
router.get("/" ,async(req,res)=>{
    //res.send('hi am the user route')
   try{
       const users =  await User.find({});
        res.status(200).json(users)
   }catch(err){
    res.status(500).json(err)
   }
})

// get one user 
router.get("/:id" ,async(req,res)=>{
    //res.send('hi am the user route')
    try{
        const user =  await User.findById(req.params.id);
        // annuler l'affichage : Password ,  updateAt
        
        res.status(200).json(user)
    }catch(err){
        res.status(500).json(err)
    }

})

//follow a user
router.put("/:id/follow" , async (req, res)=>{
    if(req.body.userId != req.params.id){
        try{
            const user =  await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followers : req.body.userId}})
                await currentUser.updateOne({$push:{following : req.params.id}})
                res.status(200).json("User has been followed")
            }else{
                res.status(403).json("You are already following this user")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(500).json("You can't follow yourself")
    }
})

//unfollow a user
router.put("/:id/unfollow" , async (req, res)=>{
    if(req.body.userId != req.params.id){
        try{
            const user =  await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers : req.body.userId}})
                await currentUser.updateOne({$pull:{following : req.params.id}})
                res.status(200).json("User has been unfollowed")
            }else{
                res.status(403).json("You are not following this user")
            }
        }catch(err){
            res.status(500).json(err)
        }
    }else{
        res.status(500).json("You can't unfollow yourself")
    }
})



module.exports= router