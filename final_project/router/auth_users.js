
const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();
const users = [];
const JWT_SECRET = 'bookshop_demo_secret';

// Check whether username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Verify username and password
const authenticatedUser = (username, password) => {
  return users.some(
    user =>
      user.username === username &&
      user.password === password
  );
};

// Task 7: Login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: 'Invalid username or password'
    });
  }

  const accessToken = jwt.sign(
    { username },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  req.session.authorization = {
    accessToken,
    username
  };

  return res.json({
    message: 'User successfully logged in'
  });
});

// Task 8: Add or modify a review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  if (!review) {
    return res.status(400).json({
      message: 'Review is required'
    });
  }

  books[isbn].reviews[username] = review;

  return res.json({
    message: 'Review successfully added or updated',
    reviews: books[isbn].reviews
  });
});

// Task 9: Delete own review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  if (!(username in books[isbn].reviews)) {
    return res.status(404).json({
      message: 'You have no review for this book'
    });
  }

  delete books[isbn].reviews[username];

  return res.json({
    message: 'Review successfully deleted'
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
