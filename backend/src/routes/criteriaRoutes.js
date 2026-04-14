const express = require('express');
const { body, param } = require('express-validator');
const criteriaController = require('../controllers/criteriaController');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', criteriaController.getAllCriteria);

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('weight').isFloat({ min: 0 }),
    body('criterion_type').optional().isString()
  ],
  validateRequest,
  criteriaController.createCriterion
);

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }),
    body('name').trim().notEmpty(),
    body('weight').isFloat({ min: 0 }),
    body('criterion_type').optional().isString()
  ],
  validateRequest,
  criteriaController.updateCriterion
);

router.delete(
  '/:id',
  [param('id').isInt({ min: 1 })],
  validateRequest,
  criteriaController.deleteCriterion
);

module.exports = router;
