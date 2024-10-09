// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT;

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Middleware to parse incoming JSON requests
app.use(express.json());

// serve static files
app.use('/eprezto/api/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/eprezto/api/', require('./routes/root'));
app.use('/eprezto/api/chatbot', require('./routes/chatbot'));

// Handle preflight requests for specific routes
app.options('/eprezto/api/chatbot', cors(corsOptions)); // Handle preflight for this route

const start = async () => {
  try {
    app.listen(PORT, () =>
      console.log(`Server is listening on port ${PORT}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start()

module.exports = app