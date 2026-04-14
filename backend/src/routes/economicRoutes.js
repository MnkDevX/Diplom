const express = require('express');
const { body } = require('express-validator');
const economicController = require('../controllers/economicController');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  [
    body('company_name').trim().notEmpty(),
    body('number_of_employees').isInt({ min: 1 }),
    body('monthly_sales').isFloat({ min: 0 }),
    body('expected_growth').isFloat({ min: 0 }),
    body('license_cost_per_user').isFloat({ min: 0 })
  ],
  validateRequest,
  economicController.calculateEconomic
);

module.exports = router;
