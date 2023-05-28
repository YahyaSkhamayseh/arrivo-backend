const Payment = require('../models/Payment');
const logger = require("../../utils/logger");

const paymentController = {
  getAllPayments: async (req, res) => {
    try {
      const payments = await Payment.getAllPayments();
      logger.info('Retrieved all payments');
      res.json(payments);
    } catch (error) {
      logger.error(`Error retrieving payments: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  getPaymentById: async (req, res) => {
    const paymentId = req.params.id;

    try {
      const payment = await Payment.getPaymentById(paymentId);

      if (payment) {
        logger.info(`Retrieved payment with ID: ${paymentId}`);
        res.json(payment);
      } else {
        logger.info(`Payment with ID ${paymentId} not found`);
        res.status(404).json({ error: 'Payment not found' });
      }
    } catch (error) {
      logger.error(`Error retrieving payment with ID ${paymentId}: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  createPayment: async (req, res) => {
    const paymentData = req.body;

    try {
      const newPayment = await Payment.createPayment(paymentData);
      logger.info(`Created payment with ID: ${newPayment.payment_id}`);
      res.status(201).json(newPayment);
    } catch (error) {
      logger.error(`Error creating payment: ${error}`);
      res.status(400).json({ error: error.message });
    }
  },

  updatePayment: async (req, res) => {
    const paymentId = req.params.id;
    const paymentData = req.body;

    try {
      const updatedPayment = await Payment.updatePayment(paymentId, paymentData);
      if (updatedPayment) {
        logger.info(`Updated payment with ID: ${updatedPayment.payment_id}`);
        res.json(updatedPayment);
      } else {
        logger.info(`Payment with ID ${paymentId} not found`);
        res.status(404).json({ error: 'Payment not found' });
      }
    } catch (error) {
      logger.error(`Error updating payment with ID ${paymentId}: ${error}`);
      res.status(400).json({ error: error.message });
    }
  },

  deletePayment: async (req, res) => {
    const paymentId = req.params.id;

    try {
      const deletedPayment = await Payment.deletePayment(paymentId);
      if (deletedPayment) {
        logger.info(`Deleted payment with ID: ${deletedPayment.payment_id}`);
        res.json(deletedPayment);
      } else {
        logger.info(`Payment with ID ${paymentId} not found`);
        res.status(404).json({ error: 'Payment not found' });
      }
    } catch (error) {
      logger.error(`Error deleting payment with ID ${paymentId}: ${error}`);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = paymentController;
