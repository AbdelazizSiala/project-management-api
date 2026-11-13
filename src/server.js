
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const { authenticate } = require('./middlewares/authMiddleware');

require('dotenv').config();

const app = express();

//Hedhom zoz express middleware nest79ohom
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.get('/test-auth', authenticate, (req, res) => {
    res.json({
        message: 'Authentication successful!',
        user: req.user
    });
});
app.get('/', (req, res) => {
    res.json({ message: 'Project Management API is running!' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
    