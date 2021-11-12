var Post = require("../models/Post")
var router = require('express').Router();



//Creat a post

router.post("/", async (req,res)=>{
    const newPost = new Post(req.body)
    
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost)
        
    }catch(err){
        res.status(500).json(err)
        
    }
})

// update a post 
router.put("/:id",async (req,res)=>{
    
    try{       
        //find the post  
        const post = await Post.findById(req.params.id)
        //verify is it the post of the same user
        console.log(post.userId)
        if(post.userId === req.body.userId){        
            await post.updateOne({$set:req.body})
            res.status(200).json("Post updated")
        }else{
            
            res.status(403).json("you can update only your posts")
        }
    } catch(err){
        
        res.status(500).json(err)

}
})

//delete a post

router.delete("/:id",async (req,res)=>{
    
    try{       
        //find the post  
        const post = await Post.findById(req.params.id)
        //verify is it the post of the same user
        if(post.userId === req.body.userId){        
            await post.deleteOne()
            res.status(200).json("Post deleted")
        }else{
            
            res.status(403).json("you can delete only your posts")
        }
    } catch(err){
        
        res.status(500).json(err)

}
})

//like/dislike  a posts
router.put("/:id/like",async(req,res)=>{
    
    try{
        //find the post
        const post = await Post.findById(req.params.id)
        //verify that this user is not liking already the posts
        if(!post.likes.includes(req.body.userId)){
            await post.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("Post has been liked")

            
        }else{
            await post.updateOne({$pull:{likes:req.body.userId}})
            res.status(200).json("Post has been disliked")          
        }

    }catch(err){
        res.status(500).status(err)
    }
    
})

//get a posts
router.get("/:id",async (req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post)
    }catch(err){
        res.status(500).json(err)
    }
})

// get timeline posts
/*router.get("/timeline", async (req,res)=>{
    let postArray =[]
    try{
        //find the current user 
        const currentUser = await User.findById(req.body.userId)
        const UserPost = await Post.find{userId : currentUser._id}

    }catch(err){
        res.status(500).json(err)
    }
})*/
module.exports= router