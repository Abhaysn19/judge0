// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Real-time notifications with Socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('submissionResult', (result) => {
    console.log('Submission Result:', result);
  });
});

// Database connection
mongoose.connect('mongodb+srv://Abhay_naik:Naikabhi19@cluster0.uo0t8mc.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

//auth
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed' });
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    req.user = user;
    next();
  });
};

// Routes
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use('/api/user', require('./routes/user'));
app.use('/api/submissions', authenticateToken, require('./routes/submission'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
