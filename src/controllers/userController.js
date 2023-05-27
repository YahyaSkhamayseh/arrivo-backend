const User = require("../models/User");
const logger = require("../../utils/logger");
const bcrypt = require("bcrypt");

// Controller actions for User
const UserController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      logger.error(`Error fetching users: ${error}`);
      res
        .status(500)
        .json({ error: "An error occurred while fetching users." });
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
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      logger.error(`Error fetching user: ${error}`);
      res
        .status(500)
        .json({ error: "An error occurred while fetching the user." });
    }
  },

  addUser: async (req, res) => {
    const { username, password, email, fullName, membership } = req.body;

    try {
      // Check if the username is already taken
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        logger.info(`ADD USER: Username ${username} already exists`);
        return res.status(409).json({ message: "Username already exists" });
      }

      // Check if the email is already taken
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        logger.info(`ADD USER: Email ${email} already exists`);
        return res.status(409).json({ message: "Email already exists" });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = {
        username,
        password: hashedPassword,
        email,
        fullName,
        membership,
      };

      // Create the user
      const newUser = await User.create(user);

      logger.info(
        `ADD USER: User registered successfully - username: ${newUser.username}`
      );
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      logger.error(`ADD USER: Error occurred - ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateUser: async (req, res) => {
    const userId = req.params.id;
    const userData = req.body;
    try {
      // Hash the password if provided
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 10);
      }

      const updatedUser = await User.update(userId, userData);
      if (updatedUser) {
        logger.info(`Updated user with ID: ${updatedUser.userId}`);
        res.json(updatedUser);
      } else {
        logger.info(`SENT: 404 Not Found: ${req.originalUrl}`);
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      res
        .status(500)
        .json({ error: "An error occurred while updating the user." });
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
        res.status(404).json({ error: "User not found." });
      }
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      res
        .status(500)
        .json({ error: "An error occurred while deleting the user." });
    }
  },

  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findByUsername(username);

      if (!user) {
        logger.info(`LOGIN: Invalid credentials for username: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isPasswordValid = await User.comparePasswords(
        password,
        user.password
      );

      if (!isPasswordValid) {
        logger.info(`LOGIN: Invalid credentials for username: ${username}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = User.generateToken(
        user.user_id,
        user.username,
        user.is_admin
      );

      logger.info(`LOGIN: User logged in - username: ${username}`);
      res.json({ token });
    } catch (error) {
      logger.error(`LOGIN: Error occurred - ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = UserController;
