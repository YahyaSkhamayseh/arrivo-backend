const Post = require('../models/Post');
const logger = require("../../utils/logger");

const postController = {
  getAllPosts: async (req, res) => {
    try {
      const user = req.user;
      const posts = await Post.getAllPosts(user);
      logger.info('Retrieved all posts');
      res.json(posts);
    } catch (error) {
      logger.error(`Error retrieving posts: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getPostById: async (req, res) => {
    const postId = req.params.id;
    const user = req.user;

    try {
      const post = await Post.getPostById(postId, user);

      if (post) {
        logger.info(`Retrieved post with ID: ${postId}`);
        res.json(post);
      } else {
        logger.info(`Post with ID ${postId} not found`);
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      logger.error(`Error retrieving post with ID ${postId}: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createPost: async (req, res) => {
    const postData = req.body;

    try {
      const newPost = await Post.createPost(postData);
      logger.info(`Created post with ID: ${newPost.post_id}`);
      res.status(201).json(newPost);
    } catch (error) {
      logger.error(`Error creating post: ${error}`);
      res.status(400).json({ error: error.message }); // Return 400 error with the error message
    }
  },

  updatePost: async (req, res) => {
    const postId = req.params.id;
    const postData = req.body;

    try {
      const updatedPost = await Post.updatePost(postId, postData);
      if (updatedPost) {
        logger.info(`Updated post with ID: ${updatedPost.post_id}`);
        res.json(updatedPost);
      } else {
        logger.info(`Post with ID ${postId} not found`);
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      logger.error(`Error updating post with ID ${postId}: ${error}`);
      res.status(400).json({ error: error.message }); // Return 400 error with the error message
    }
  },

  deletePost: async (req, res) => {
    const postId = req.params.id;

    try {
      const deletedPost = await Post.deletePost(postId);
      if (deletedPost) {
        logger.info(`Deleted post with ID: ${deletedPost.post_id}`);
        res.json(deletedPost);
      } else {
        logger.info(`Post with ID ${postId} not found`);
        res.status(404).json({ error: 'Post not found' });
      }
    } catch (error) {
      logger.error(`Error deleting post with ID ${postId}: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = postController;
