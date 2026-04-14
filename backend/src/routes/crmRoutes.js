const express = require('express');
const { body, param } = require('express-validator');
const crmController = require('../controllers/crmController');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.get('/', crmController.getAllCrm);

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('base_price').optional().isFloat({ min: 0 }),
    body('website_url').optional({ nullable: true }).isURL()
  ],
  validateRequest,
  crmController.createCrm
);

router.put(
  '/:id',
  [
    param('id').isInt({ min: 1 }),
    body('name').trim().notEmpty(),
    body('base_price').optional().isFloat({ min: 0 }),
    body('website_url').optional({ nullable: true }).isURL()
  ],
  validateRequest,
  crmController.updateCrm
);

router.delete('/:id', [param('id').isInt({ min: 1 })], validateRequest, crmController.deleteCrm);

module.exports = router;
