const pool = require("../services/db");
const { validateUser } = require("../services/validators/userValidator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class User {

  static async getAll() {
    const query = "SELECT * FROM users";
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getById(userId) {
    const query = "SELECT * FROM users WHERE user_id = $1";
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  }

  static async create(userData) {
    const { error, value } = validateUser(userData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { username, password, email, fullName, membership, isAdmin } = value;
    const query =
      "INSERT INTO users (username, password, email, full_name, membership, created_at, updated_at, is_admin) VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), $6) RETURNING *";
    const { rows } = await pool.query(query, [
      username,
      password,
      email,
      fullName,
      membership,
      isAdmin,
    ]);
    return rows[0];
  }

  static async update(userId, userData) {
    const { error, value } = validateUser(userData, true);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { username, password, email, fullName, membership, isAdmin } = value;
    const queryParts = [];
    const queryParams = [userId];
    let paramIndex = 2;

    if (username) {
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        throw new Error("Username already exists");
      }

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
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        throw new Error("Email already exists");
      }

      queryParts.push(`email = $${paramIndex}`);
      queryParams.push(email);
      paramIndex++;
    }

    if (fullName) {
      queryParts.push(`full_name = $${paramIndex}`);
      queryParams.push(fullName);
      paramIndex++;
    }

    if (membership) {
      queryParts.push(`membership = $${paramIndex}`);
      queryParams.push(membership);
    }

    if (isAdmin) {
      queryParts.push(`is_admin = $${paramIndex}`);
      queryParams.push(isAdmin);
    }

    const query = `UPDATE users SET ${queryParts.join(
      ", "
    )}, updated_at = NOW() WHERE user_id = $1 RETURNING *`;

    const { rows } = await pool.query(query, queryParams);
    return rows[0];
  }

  static async delete(userId) {
    const query = "DELETE FROM users WHERE user_id = $1 RETURNING *";
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
  }

  static async findByUsername(username) {
    const query = "SELECT * FROM users WHERE username = $1";
    const { rows } = await pool.query(query, [username]);
    return rows[0];
  }

  static async findByEmail(email) {
    const query = "SELECT * FROM users WHERE email = $1";
    const { rows } = await pool.query(query, [email]);
    return rows[0];
  }

  static async comparePasswords(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  static generateToken(userId, username, isAdmin) {
    const token = jwt.sign(
      { userId, username, isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  }
}

module.exports = User;
