const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/register', customerController.registerCustomer);
router.post('/login', customerController.loginCustomer);
router.get('/profile/:customer_id', customerController.getProfile);
router.get('/customers', customerController.getAllCustomers);
router.put('/customers/:customer_id', customerController.updateCustomer);
router.delete('/customers/:customer_id', customerController.deleteCustomer);

module.exports = router;


