const express = require("express");
const UserController = require("../src/controllers/userController");

// Create a router instance
const router = express.Router();

// User routes
router.get("/users", UserController.getAllUsers);
router.get("/users/:id", UserController.getUserById);
router.post("/users", UserController.createUser);
router.put("/users/:id", UserController.updateUser);
router.delete("/users/:id", UserController.deleteUser);

module.exports = router;
