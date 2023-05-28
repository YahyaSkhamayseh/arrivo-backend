const express = require('express');
const paymentController = require('../src/controllers/paymentController');
const { verifyAdminToken, verifyToken } = require("../src/services/tokenVerification");

const router = express.Router();

router.get('/payments', verifyAdminToken, paymentController.getAllPayments);
router.get('/payments/:id', verifyAdminToken, paymentController.getPaymentById);
router.post('/payments', verifyToken, paymentController.createPayment);
router.put('/payments/:id', verifyAdminToken, paymentController.updatePayment);
router.delete('/payments/:id', verifyAdminToken, paymentController.deletePayment);

module.exports = router;
