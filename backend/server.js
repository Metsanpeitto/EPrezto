// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT;

const app = express();
app.use(express.json());
app.use(cors());

// Middleware to parse incoming JSON requests
app.use(express.json());

// serve static files
app.use('/api/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/api/', require('./routes/root'));
app.use('/api/chatbot', require('./routes/chatbot'));

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