
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();

const app = express();

const { authenticate, authorizeRoles } = require('./middlewares/authMiddleware');
app.get('/test-manager', authenticate, authorizeRoles('manager'), (req, res) => {
    res.json({
        message: 'Manager access granted!',
        user: req.user
    });
});

//Hedhom zoz express middleware nest79ohom
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
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
    