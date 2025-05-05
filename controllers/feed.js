const Post = require('../models/post');
const fs = require('fs');
const path = require('path');
const User = require('../models/user');


exports.getPosts = async (req,res,next)=>{
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems;
    try{
    totalItems = await Post.find.countDocuments();
        const post = await Post.find().skip((currentPage-1)*perPage).limit(perPage);
   
        res.status(200).json({
            message:"Fetched post successfully",
            posts:posts,
            totalItems:totalItems

    })
}catch(err){
    console.log(err);
}

    Post.find().then(posts=>{
        res.status(200).json({
            message:"Fetched post successfully",
            posts:posts
        })
    }).catch(err=>console.log(err));
}

exports.createPost = (req,res,next)=>{
    if(!req.file){
        const error = new Error('No image Found.')
        error.statusCode = 422;
        throw error;
    }
    const imageUrl = req.file.path;
    const title = req.body.title;
    const content = req.body.content;
    let creator;

    // Create post in db
    const post = new Post({
         content:content,
         title:title,
         imageUrl:imageUrl,
         creator:req.userId,
    });
    post.save().then(result=>{
        console.log(result)
        return User.findById(req.userId);
}).then(user=>{
    creator = user;
    user.post.push(post);
    return user.save();   
    }).then(result=>{
        res.status(201).json({
        message:'Post created successfully!',
        post:post,
        creator:{_id:creator._id,name:creator.name}
    }) 
    }).catch(err=>console.log(err));
}

exports.getPost = (req,res,next)=>{
    const postId=req.params.postId;
    Post.findById(postId)
    .then(post=>{
        if(!post){
            throw("Could not find the poat")
        }
        res.status(200).json({post:post});
    }).catch(err=>console.log("err"))
}

exports.updatePost = (req,res,next)=>{
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.body.image;

    if(req.file){
        imageUrl = req.file.path;

    }
    if(!imageUrl){
        const error = new Error('No file picked')
        error.statusCode = 422;
        throw error;
    }
    Post.findById(postId).then(post =>{
         if(!post){
            throw("Could not find the poat")
        }
        if(post.creator.toString() !== req.userId ){
            throw new Error("Not authorized");
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl;
        return post.save();
    }).then(result =>{
        res.status(200).json({message:"Post Updated!"});
    }).catch(err=>console.log("err"))
}

const clearImage = filePath =>{
    filepath = path.join(__dirname,'..',filePath);
    fs.unlink(filePath,err=>console.log(err))
}
exports.deletePost =(req,res,next)=>{
    const postId = req.params.postId;
     Post.findById(postId).then(post=>{
        // check loggedIn user
         if(!post){
            throw("Could not find the poat")
        }
        if(post.creator.toString() !== req.userId ){
            throw new Error("Not authorized");
        } 
        clearImage(post.imageUrl);
        return Post.findByIdAndDelete(postId);
     }).then(result=>{
        User.findById(req.userId);
     }).then(user=>{
        console.log(result)
        user.posts.pull(postId);
        return user.save();
     }).then(result=>{
        res.status(200).json({message:'Deleted Post.'})
     }
    ).catch(err=>console.log(err))
} 