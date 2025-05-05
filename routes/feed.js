const express = require('express');
const feedController = require('../controllers/feed');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/posts',isAuth,feedController.getPosts);
router.post('/post',isAuth,feedController.createPost);
router.get('/post/:postId',isAuth,feedController.getPost)

router.put('/post/:postId',isAuth,feedController.updatePost);
router.delete('/post/:postId',isAuth,feedController.deletePost);


module.exports = router;