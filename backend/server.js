// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const { sessionTimeout } = require('./middlewares/sessionTimeout');
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT;

const corsOptions = {
  origin: ['http://www.tienduca.com','http://localhost:5173', '*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET || 'defaultSecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 600000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Strict'
  }
}));
app.use(sessionTimeout)

// serve static files
app.use('/eprezto/api/', express.static(path.join(__dirname, '/public')));

// routes
app.use('/eprezto/api/', require('./routes/root'));
app.use('/eprezto/api/chatbot', require('./routes/chatbot'));
app.use('/eprezto/api/session', require('./routes/session'));

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