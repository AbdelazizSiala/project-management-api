
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');

require('dotenv').config();

const app = express();

//Hedhom zoz express middleware nest79ohom
app.use(cors());
app.use(express.json());

app.use('/', authRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
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
    