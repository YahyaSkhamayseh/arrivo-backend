const express = require("express");
const UserController = require("../src/controllers/userController");
const { verifyAdminToken } = require("../src/services/tokenVerification");

const router = express.Router();

// User routes
router.get("/users", verifyAdminToken, UserController.getAllUsers);
router.get("/users/:id", verifyAdminToken, UserController.getUserById);
router.post("/users", verifyAdminToken, UserController.addUser);
router.put("/users/:id", verifyAdminToken, UserController.updateUser);
router.delete("/users/:id", verifyAdminToken, UserController.deleteUser);

// Login route
router.post("/login", UserController.login);

module.exports = router;
