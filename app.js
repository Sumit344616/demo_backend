require('dotenv').config();
const express = require('express');
const app = express();
const PORT=8080
const cors = require('cors');
const connectDB = require('./src/config/connection');
const errorHandler = require('./src/middlewares/errorHandler');
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
const routes = require('./src/routes/routes');
app.use('/api', routes);
app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
