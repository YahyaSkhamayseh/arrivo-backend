const pool = require("../services/db");
const { validateUser } = require("../services/validators/userValidator");

class User {
  constructor(
    userId,
    username,
    password,
    email,
    fullName,
    membership,
    createdAt,
    updatedAt
  ) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.email = email;
    this.fullName = fullName;
    this.membership = membership;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async getAll() {
    const query = "SELECT * FROM users";
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(userId) {
    const query = "SELECT * FROM users WHERE userId = $1";
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  }

  static async create(userData) {
    const { error } = validateUser(userData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { username, password, email, fullName, membership } = userData;
    const query =
      "INSERT INTO users (username, password, email, fullName, membership, createdAt, updatedAt) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *";
    const { rows } = await pool.query(query, [
      username,
      password,
      email,
      fullName,
      membership,
    ]);
    return rows[0];
  }

  static async update(userId, userData) {
    const { error } = validateUser(userData, true);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { username, password, email, fullName, membership } = userData;
    const queryParts = [];
    const queryParams = [userId];
    let paramIndex = 2;

    if (username) {
      queryParts.push(`username = $${paramIndex}`);
      queryParams.push(username);
      paramIndex++;
    }

    if (password) {
      queryParts.push(`password = $${paramIndex}`);
      queryParams.push(password);
      paramIndex++;
    }

    if (email) {
      queryParts.push(`email = $${paramIndex}`);
      queryParams.push(email);
      paramIndex++;
    }

    if (fullName) {
      queryParts.push(`fullName = $${paramIndex}`);
      queryParams.push(fullName);
      paramIndex++;
    }

    if (membership) {
      queryParts.push(`membership = $${paramIndex}`);
      queryParams.push(membership);
    }

    const query = `UPDATE users SET ${queryParts.join(
      ", "
    )}, updatedAt = NOW() WHERE userId = $1 RETURNING *`;

    const { rows } = await pool.query(query, queryParams);
    return rows[0];
  }

  static async delete(userId) {
    const query = "DELETE FROM users WHERE userId = $1 RETURNING *";
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  }
}

module.exports = User;
