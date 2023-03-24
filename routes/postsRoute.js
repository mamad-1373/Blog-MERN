const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");

const router = express.Router();

//CREATE POST
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json({
      message: "posted successfully",
      savedPost,
    });
  } catch (error) {
    res.status(500).json(error);
  }
});
//UPDATE POST
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const udatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json({
          message: "post updated successfully",
          udatedPost,
        });
      } catch (error) {
        res.status(401).json("You can update only your post");
      }
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

//DELETE POST
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.deleteOne();
        res.status(200).json({
          message: "post deleted",
        });
      } catch (error) {
        res.status(401).json("You can delete only your post");
        // console.log(error);
      }
    }
  } catch (error) {
    res.status(500).json(error);
    // console.log(error);
  }
});

//GET POST:
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
    // console.log(error);
  }
});

//GET ALL POSTS || GET
router.get("/", async (req, res) => {
    const username = req.query.user
    const catname = req.query.cat
    try {
        let posts;
        if(username){
            posts = await Post.find({username})
        }else if(catname){
            posts = await Post.find({categories:{
                $in:[catname]
            }})
        }else{
            posts = await Post.find()
        }
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json(error);
      // console.log(error);
    }
  });

module.exports = router;
