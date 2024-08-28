const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const winston = require('winston');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Winston for logging
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console(),
    ],
});

// Connect to MongoDB
mongoose.connect('mongodb+srv://nithinkumar02:N%40thin%40388@cluster0.mlzop.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => logger.info('MongoDB connected'))
  .catch(err => logger.error('MongoDB connection error:', err));

// Middleware
app.use(bodyParser.json());

// User Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model('User', userSchema);

// API Endpoints
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        logger.info('User created:', user);
        res.status(201).json(user);
    } catch (error) {
        logger.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            logger.warn('User not found:', req.params.id);
            return res.status(404).json({ error: 'User not found' });
        }
        logger.info('User updated:', user);
        res.json(user);
    } catch (error) {
        logger.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        logger.info('Users retrieved:', users);
        res.json(users);
    } catch (error) {
        logger.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
const server = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

module.exports = { app, server }; // Export app and server