const express = require("express");
const router = express.Router();
const Post = require('../../models/Post');
const User = require('../../models/User');
const Comment = require("../../models/Comment");
const passport = require('passport');
const jwt_decode = require('jwt-decode');

router.get("/", (req, res) => {
  const token = req.headers.authorization;
  const user = jwt_decode(token);
  User.findOne({ _id: user.id })
  .then(user => {  
     let following = user.following;
     following.push(user.id);
     Post.find({ user: { $in: following }}).sort([['date', -1]])
     .then(posts => {
       let postsObject = {};
       posts.forEach(post => postsObject[post._id] = post)
       res.send({ posts: postsObject });
     });
     
  }) ;
});

router.get("/id", (req, res) => {
  const token = req.headers.authorization;
  const user = jwt_decode(token);
  if (user) {
    Post.findOne({ _id: req.query.id })
      .populate('user')
      // .populate('comments')
      .populate({
        path: 'comments',
        model: 'comments',
        populate: {
          path: 'user',
          model: 'users'
        }
      })
      .then(post => {
        let comments = post.comments;
        let comment_ids = comments.map(ele => ele._id);
        post.comments = comment_ids;
        let users = comments.map(ele => ele.user);
    
        let users_ids = users.map(ele => ele._id);
   
        comments.forEach((comment, i) => {
          comment.user = users_ids[i];
        });
 
        let finalUsers = {};
        users.forEach(user => {
          finalUsers[user._id] = user;
        });
        let user = post.user;
        post.user = user._id;
        let finalUser = { [user._id]: user };
        res.send( {post: post, user: finalUser, users: finalUsers, comments: comments});
      });
  }

});

router.get("/username", (req, res) => {
  const token = req.headers.authorization;
  const user = jwt_decode(token);
  if (user) {
    Post.find({ user: req.query.id }).sort({ "date": -1 })
      .then(posts => {
        res.send({posts});
      });
  }
});

router.post("/id/comment", (req, res) => {
  const token = req.headers.authorization;
  const user = jwt_decode(token);
  if (user) {
    const newComment = new Comment({
      user: req.body.user_id,
      post: req.body.post_id,
      body: req.body.text
    });

    newComment.save().then( (comment) => {
      Post.findOne({ _id: req.body.post_id })
        .then(post => {
          post.comments.push(comment);
          post
            .save().then((post) => {
              Post.findOne({ _id: post._id })
              .populate('users')
              .populate({
                path: 'comments',
                model: 'comments',
                populate: {
                  path: 'user',
                  model: 'users'
                }
              }).then( (post) => {
            
                let comments = post.comments;
                let comment_ids = comments.map(ele => ele._id);
                post.comments = comment_ids;
                let users = comments.map(ele => ele.user);

                let users_ids = users.map(ele => ele._id);

                comments.forEach((comment, i) => {
                  comment.user = users_ids[i];
                });

                let finalUsers = {};
                users.forEach(user => {
                  finalUsers[user._id] = user;
                });
                let user = post.user;
                post.user = user._id;
                let finalUser = { [user._id]: user };
                res.send({ post: post, user: finalUser, users: finalUsers, comments: comments });
              });
            });
        }); 
      });
    }
  }
);

router.get("/comments", (req, res) => {
  const token = req.headers.authorization;
  const user = jwt_decode(token);
  if (user) {
    console.log("here isnide");
    Comment.find({ post: req.query.id }).sort({ "date": -1 })
      .then(comments => {
        res.send({ comments });
      });
  }
});


router.post('/like', (req, res) => {
  const postId = req.body.postId;
  const userId = req.body.userId;
 
  Post.findOne({ _id: postId })
  .then(post => {
    User.findOne({ _id: userId })
    .then(user => {
      user.likes.push(post._id);
      user.save();
      post.likes.push(user._id);
      post.save();
      res.send({post});
    });
  });
});

router.patch('/unlike', (req, res) => {
  const postId = req.body.postId;
  const userId = req.body.userId;

  User.findOne({ _id: userId })
    .then(user => {

      for (let i = 0; i < user.likes.length; i++) {
        if (user.likes[i] == postId) {
          user.likes.splice(i, 1);
        }
      }
      user.save();
    })
    .then(() => {
      Post.findOne({ _id: postId }).then(post => {
        for (let i = 0; i < post.likes.length; i++) {
          if (post.likes[i] == userId) {
            post.likes.splice(i, 1);
          }
        }
        post.save();
        res.send({post});
      });
    });

});

module.exports = router;