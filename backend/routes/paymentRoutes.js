const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getAllPayments);
router.get('/:payment_id', paymentController.getPaymentById);
router.put('/:payment_id/status', paymentController.updatePaymentStatus);
router.delete('/:payment_id', paymentController.deletePayment);

module.exports = router;
