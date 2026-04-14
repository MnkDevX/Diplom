const crmModel = require('../models/crmModel');

const getAllCrm = async (req, res, next) => {
  try {
    const data = await crmModel.getAll();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const createCrm = async (req, res, next) => {
  try {
    const data = await crmModel.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
};

const updateCrm = async (req, res, next) => {
  try {
    const data = await crmModel.update(req.params.id, req.body);
    if (!data) {
      return res.status(404).json({ message: 'CRM not found' });
    }
    res.json(data);
  } catch (err) {
    next(err);
  }
};

const deleteCrm = async (req, res, next) => {
  try {
    const data = await crmModel.remove(req.params.id);
    if (!data) {
      return res.status(404).json({ message: 'CRM not found' });
    }
    res.json({ message: 'CRM deleted', data });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllCrm, createCrm, updateCrm, deleteCrm };
