const criteriaModel = require('../models/criteriaModel');

const getAllCriteria = async (req, res, next) => {
  try {
    const data = await criteriaModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createCriterion = async (req, res, next) => {
  try {
    const data = await criteriaModel.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateCriterion = async (req, res, next) => {
  try {
    const data = await criteriaModel.update(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({ message: 'Criterion not found' });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteCriterion = async (req, res, next) => {
  try {
    const data = await criteriaModel.remove(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'Criterion not found' });
    }
    res.json({ message: 'Criterion deleted', data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCriteria, createCriterion, updateCriterion, deleteCriterion };
