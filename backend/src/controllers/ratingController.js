const ratingModel = require('../models/ratingModel');

const saveRating = async (req, res, next) => {
  try {
    const data = await ratingModel.upsert(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const getSummary = async (req, res, next) => {
  try {
    const summary = await ratingModel.getSummary();
    const matrix = await ratingModel.getMatrix();
    res.json({ summary, matrix });
  } catch (err) {
    next(err);
  }
};

module.exports = { saveRating, getSummary };
