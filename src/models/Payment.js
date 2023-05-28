const pool = require("../services/db");
const { validatePayment } = require("../services/validators/paymentValidation");

class Payment {
  static async getAllPayments() {
    const query = "SELECT * FROM payment";
    const { rows } = await pool.query(query);
    return rows;
  }

  static async getPaymentById(paymentId) {
    const query = "SELECT * FROM payment WHERE payment_id = $1";
    const { rows } = await pool.query(query, [paymentId]);
    return rows[0];
  }

  static async createPayment(paymentData) {
    const { error, value } = validatePayment(paymentData);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { amount, payment_method, status } = value;

    const query =
      "INSERT INTO payment (amount, payment_method, status) VALUES ($1, $2, $3) RETURNING *";
    const { rows } = await pool.query(query, [amount, payment_method, status]);
    return rows[0];
  }

  static async updatePayment(paymentId, paymentData) {
    const { error, value } = validatePayment(paymentData, true);
    if (error) {
      throw new Error(error.details[0].message);
    }

    const { amount, payment_method, status } = value;

    const queryParts = [];
    const queryParams = [paymentId];
    let paramIndex = 2;

    if (amount !== undefined) {
      queryParts.push(`amount = $${paramIndex}`);
      queryParams.push(amount);
      paramIndex++;
    }

    if (payment_method !== undefined) {
      queryParts.push(`payment_method = $${paramIndex}`);
      queryParams.push(payment_method);
      paramIndex++;
    }

    if (status !== undefined) {
      queryParts.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    const query = `UPDATE payment SET ${queryParts.join(
      ", "
    )}, updated_at = NOW() WHERE payment_id = $1 RETURNING *`;

    const { rows } = await pool.query(query, queryParams);
    return rows[0];
  }

  static async deletePayment(paymentId) {
    const query = "DELETE FROM payment WHERE payment_id = $1 RETURNING *";
    const { rows } = await pool.query(query, [paymentId]);
    return rows[0];
  }
}

module.exports = Payment;
