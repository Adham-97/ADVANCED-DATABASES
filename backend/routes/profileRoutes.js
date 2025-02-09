const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.get('/:customer_id', profileController.getProfile);
router.put('/:customer_id', profileController.updateProfile);

module.exports = router;
