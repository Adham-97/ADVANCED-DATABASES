const Payment = require('../models/payment'); // Import Payment model

// Create a new payment
exports.createPayment = async (req, res) => {
  try {
    const { payment_id, booking_id, customer_id, amount, payment_method, status, transaction_details } = req.body;

    const newPayment = new Payment({
      payment_id,
      booking_id,
      customer_id,
      amount,
      payment_method,
      status,
      transaction_details,
    });

    await newPayment.save();
    res.status(201).json({ message: 'Payment recorded successfully!', payment: newPayment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to record payment' });
  }
};

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const payment = await Payment.findOne({ payment_id });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch payment' });
  }
};

// Update payment status by ID
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { status } = req.body;

    const updatedPayment = await Payment.findOneAndUpdate(
      { payment_id },
      { status },
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment status updated successfully!', payment: updatedPayment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update payment status' });
  }
};

// Delete payment by ID
exports.deletePayment = async (req, res) => {
  try {
    const { payment_id } = req.params;
    const deletedPayment = await Payment.findOneAndDelete({ payment_id });

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.status(200).json({ message: 'Payment deleted successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete payment' });
  }
};
