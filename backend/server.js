const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db/database');
const chatRoutes = require('./routes/chat');
const transcribeRoutes = require('./routes/transcribe');
const pronunciationRoutes = require('./routes/pronunciation');
const progressRoutes = require('./routes/progress');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: 'http://localhost:5173' }));
// Increase payload limit for audio files
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/transcribe', transcribeRoutes);
app.use('/api/analyze-pronunciation', pronunciationRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
