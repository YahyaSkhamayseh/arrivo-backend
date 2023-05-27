const User = require('../models/User');
const logger = require('../../utils/logger');

// Controller actions for User
const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      logger.error(`Error fetching users: ${error}`);
      res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
  },

  getUserById: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.getById(userId);
      if (user) {
        res.json(user);
      } else {
        logger.info(`SENT: 404 Not Found: ${req.originalUrl}`);
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      logger.error(`Error fetching user: ${error}`);
      res.status(500).json({ error: 'An error occurred while fetching the user.' });
    }
  },

  createUser: async (req, res) => {
    const userData = req.body;
    try {
      const user = await User.create(userData);
      logger.info(`Created user with ID: ${user.userId}`);
      res.status(201).json(user);
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    try {
      const updatedUser = await User.update(userId, userData);
      if (updatedUser) {
        logger.info(`Updated user with ID: ${updatedUser.userId}`);
        res.json(updatedUser);
      } else {
        logger.info(`SENT: 404 Not Found: ${req.originalUrl}`);
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      res.status(500).json({ error: 'An error occurred while updating the user.' });
    }
  },

  deleteUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await User.delete(userId);
      if (deletedUser) {
        logger.info(`Deleted user with ID: ${deletedUser.userId}`);
        res.json(deletedUser);
      } else {
        logger.info(`SENT: 404 Not Found: ${req.originalUrl}`);
        res.status(404).json({ error: 'User not found.' });
      }
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      res.status(500).json({ error: 'An error occurred while deleting the user.' });
    }
  },
};

module.exports = UserController;
