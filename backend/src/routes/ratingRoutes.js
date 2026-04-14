const express = require('express');
const { body } = require('express-validator');
const ratingController = require('../controllers/ratingController');
const { validateRequest } = require('../middleware/validateRequest');

const router = express.Router();

router.post(
  '/',
  [
    body('crm_id').isInt({ min: 1 }),
    body('criterion_id').isInt({ min: 1 }),
    body('score').isInt({ min: 1, max: 10 }),
    body('comment').optional().isString()
  ],
  validateRequest,
  ratingController.saveRating
);

router.get('/summary', ratingController.getSummary);

module.exports = router;
