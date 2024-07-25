const express = require('express');
const corsMiddleware = require('./middlewares/cors');
const userRoutes = require('./routes/user');

const app = express();
app.use(corsMiddleware);
app.use(express.json());
app.use('/users', userRoutes);

module.exports = app;