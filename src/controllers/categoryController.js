const Category = require('../models/Category');
const logger = require("../../utils/logger");

const categoryController = {
  getAllCategories: async (req, res) => {
    const user = req.user;

    try {
      const categories = await Category.getAllCategories(user);
      logger.info('Retrieved all categories');
      res.json(categories);
    } catch (error) {
      logger.error(`Error retrieving categories: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getCategoryById: async (req, res) => {
    const categoryId = req.params.id;
    const user = req.user;

    try {
      const category = await Category.getCategoryById(categoryId, user);

      if (category) {
        logger.info(`Retrieved category with ID: ${categoryId}`);
        res.json(category);
      } else {
        logger.info(`Category with ID ${categoryId} not found`);
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      logger.error(`Error retrieving category with ID ${categoryId}: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createCategory: async (req, res) => {
    const categoryData = req.body;

    try {
      const newCategory = await Category.createCategory(categoryData);
      logger.info(`Created category with ID: ${newCategory.category_id}`);
      res.status(201).json(newCategory);
    } catch (error) {
      logger.error(`Error creating category: ${error}`);
      res.status(400).json({ error: error.message }); // Return 400 error with the error message
    }
  },

  updateCategory: async (req, res) => {
    const categoryId = req.params.id;
    const categoryData = req.body;

    try {
      const updatedCategory = await Category.updateCategory(categoryId, categoryData);
      if (updatedCategory) {
        logger.info(`Updated category with ID: ${updatedCategory.category_id}`);
        res.json(updatedCategory);
      } else {
        logger.info(`Category with ID ${categoryId} not found`);
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      logger.error(`Error updating category with ID ${categoryId}: ${error}`);
      res.status(400).json({ error: error.message }); // Return 400 error with the error message
    }
  },

  deleteCategory: async (req, res) => {
    const categoryId = req.params.id;

    try {
      const deletedCategory = await Category.deleteCategory(categoryId);
      if (deletedCategory) {
        logger.info(`Deleted category with ID: ${deletedCategory.category_id}`);
        res.json(deletedCategory);
      } else {
        logger.info(`Category with ID ${categoryId} not found`);
        res.status(404).json({ error: 'Category not found' });
      }
    } catch (error) {
      logger.error(`Error deleting category with ID ${categoryId}: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = categoryController;
