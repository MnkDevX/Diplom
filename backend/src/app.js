const express = require('express');
const cors = require('cors');
require('dotenv').config();

const crmRoutes = require('./routes/crmRoutes');
const criteriaRoutes = require('./routes/criteriaRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const economicRoutes = require('./routes/economicRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000'
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/crm', crmRoutes);
app.use('/api/criteria', criteriaRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/economic', economicRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
