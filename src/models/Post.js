const pool = require("../services/db");
const { validatePost } = require("../services/validators/postValidation");

class Post {
  static async getAllPosts(user) {
    let query;

    if (user.isAdmin) {
      query = "SELECT * FROM post";
    } else if (user.membership === "Premium") {
      query = "SELECT * FROM post WHERE status = 'Published'";
    } else {
      query =
        "SELECT * FROM post WHERE status = 'Published' AND label = 'Normal'";
    }

    const { rows } = await pool.query(query);
    return rows;
  }

  static async getPostById(postId, user) {
    let query;

    if (user.isAdmin) {
      query = "SELECT * FROM post WHERE post_id = $1";
    } else if (user.membership === "Premium") {
      query = "SELECT * FROM post WHERE post_id = $1 AND status = 'Published'";
    } else {
      query =
        "SELECT * FROM post WHERE post_id = $1 AND status = 'Published' AND label = 'Normal'";
    }

    const { rows } = await pool.query(query, [postId]);
    return rows[0];
  }

  static async createPost(postData) {
    const { error, value } = validatePost(postData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { title, body, category_id, status, label } = value;
    const query =
      "INSERT INTO post (title, body, category_id, status, label) VALUES ($1, $2, $3, $4, $5) RETURNING *";
    const { rows } = await pool.query(query, [
      title,
      body,
      category_id,
      status,
      label,
    ]);
    return rows[0];
  }

  static async updatePost(postId, postData) {
    const { error, value } = validatePost(postData, true);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { title, body, category_id, status, label } = value;

    const queryParts = [];
    const queryParams = [postId];
    let paramIndex = 2;

    if (title) {
      queryParts.push(`title = $${paramIndex}`);
      queryParams.push(title);
      paramIndex++;
    }

    if (body) {
      queryParts.push(`body = $${paramIndex}`);
      queryParams.push(body);
      paramIndex++;
    }

    if (category_id) {
      queryParts.push(`category_id = $${paramIndex}`);
      queryParams.push(category_id);
      paramIndex++;
    }

    if (status) {
      queryParts.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (label) {
      queryParts.push(`label = $${paramIndex}`);
      queryParams.push(label);
      paramIndex++;
    }

    const query = `UPDATE post SET ${queryParts.join(
      ", "
    )}, updated_at = NOW() WHERE post_id = $1 RETURNING *`;

    const { rows } = await pool.query(query, queryParams);
    return rows[0];
  }

  static async deletePost(postId) {
    const query = "DELETE FROM post WHERE post_id = $1 RETURNING *";
    const { rows } = await pool.query(query, [postId]);
    return rows[0];
  }
}

module.exports = Post;
