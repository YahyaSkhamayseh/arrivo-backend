const express = require('express');
const categoryController = require('../src/controllers/categoryController');
const { verifyAdminToken, verifyToken } = require("../src/services/tokenVerification");

const router = express.Router();


router.get('/categories', verifyToken, categoryController.getAllCategories);
router.get('/categories/:id', verifyToken, categoryController.getCategoryById);
router.post('/categories', verifyAdminToken, categoryController.createCategory);
router.put('/categories/:id', verifyAdminToken, categoryController.updateCategory);
router.delete('/categories/:id', verifyAdminToken, categoryController.deleteCategory);

module.exports = router;
