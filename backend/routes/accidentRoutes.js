const express = require('express');
const router = express.Router();
const accidentController = require('../controllers/accidentController');

router.post('/accident', accidentController.createAccident);
router.get('/accidents/:car_id', accidentController.getAccidentsByVehicle);
router.get('/accidents', accidentController.getAllAccidents);

module.exports = router;

