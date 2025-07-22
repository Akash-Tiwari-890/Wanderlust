// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const NODE_PORT = 3000;
// *** CHANGE THIS LINE ***
const PYTHON_CHATBOT_URL = 'http://127.0.0.1:5000/chat'; // <-- Changed from /chatbot_message to /chat

app.use(express.json());
app.use(cors());

// Serve your HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// New route for your chatbot interaction
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const pythonChatbotResponse = await axios.post(PYTHON_CHATBOT_URL, {
            message: userMessage
        });

        res.json({ reply: pythonChatbotResponse.data.response });
    } catch (error) {
        console.error('Error communicating with Python chatbot:', error.message);
        if (error.response) {
            console.error('Python Chatbot Error Response Data:', error.response.data);
            res.status(error.response.status).json({
                error: 'Error from chatbot API',
                details: error.response.data
            });
        } else if (error.request) {
            res.status(500).json({ error: 'No response from chatbot API. Is App6.py running?' });
        } else {
            res.status(500).json({ error: 'Failed to send request to chatbot API' });
        }
    }
});

app.listen(NODE_PORT, () => {
    console.log(`Node.js app listening at http://localhost:${NODE_PORT}`);
});