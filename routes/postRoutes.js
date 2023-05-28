const express = require('express');
const postController = require('../src/controllers/postController');
const { verifyAdminToken, verifyToken } = require("../src/services/tokenVerification");

const router = express.Router();

router.get('/posts', verifyToken, postController.getAllPosts);
router.get('/posts/:id', verifyToken, postController.getPostById);
router.post('/posts', verifyAdminToken, postController.createPost);
router.put('/posts/:id', verifyAdminToken, postController.updatePost);
router.delete('/posts/:id', verifyAdminToken, postController.deletePost);

module.exports = router;
