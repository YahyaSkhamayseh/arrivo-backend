const pool = require("../services/db");
const {
  validateCategory,
} = require("../services/validators/categoryValidation");

class Category {
  static async getAllCategories(user) {
    let query;

    if (user.isAdmin) {
      query = "SELECT * FROM category";
    } else {
      query = "SELECT * FROM category WHERE activated = true";
    }

    const { rows } = await pool.query(query);
    return rows;
  }

  static async getCategoryById(categoryId, user) {
    let query;

    if (user.isAdmin) {
      query = "SELECT * FROM category WHERE category_id = $1";
    } else {
      query =
        "SELECT * FROM category WHERE category_id = $1 AND activated = true";
    }

    const { rows } = await pool.query(query, [categoryId]);
    return rows[0];
  }

  static async createCategory(categoryData) {
    const { error, value } = validateCategory(categoryData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { name, description, activated } = value;
    const query =
      "INSERT INTO category (name, description, activated) VALUES ($1, $2, $3) RETURNING *";
    const { rows } = await pool.query(query, [name, description, activated]);
    return rows[0];
  }

  static async updateCategory(categoryId, categoryData) {
    const { error, value } = validateCategory(categoryData, true);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { name, description, activated } = value;

    const queryParts = [];
    const queryParams = [categoryId];
    let paramIndex = 2;

    if (name) {
      queryParts.push(`name = $${paramIndex}`);
      queryParams.push(name);
      paramIndex++;
    }

    if (description) {
      queryParts.push(`description = $${paramIndex}`);
      queryParams.push(description);
      paramIndex++;
    }

    if (typeof activated !== "undefined") {
      queryParts.push(`activated = $${paramIndex}`);
      queryParams.push(activated);
      paramIndex++;
    }

    const query = `UPDATE category SET ${queryParts.join(
      ", "
    )}, updated_at = NOW() WHERE category_id = $1 RETURNING *`;

    const { rows } = await pool.query(query, queryParams);
    return rows[0];
  }

  static async deleteCategory(categoryId) {
    const query = "DELETE FROM category WHERE category_id = $1 RETURNING *";
    const { rows } = await pool.query(query, [categoryId]);
    return rows[0];
  }
}

module.exports = Category;
