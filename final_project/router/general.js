
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

// Task 6: Register a new user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  users.push({ username, password });

  return res.status(201).json({
    message: 'User successfully registered'
  });
});

// Task 1: Get all books
public_users.get('/', (req, res) => {
  return res.json(books);
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  return res.json(book);
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (
      books[isbn].author.toLowerCase() ===
      req.params.author.toLowerCase()
    ) {
      result[isbn] = books[isbn];
    }
  });

  return res.json(result);
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
  const result = {};

  Object.keys(books).forEach(isbn => {
    if (
      books[isbn].title.toLowerCase() ===
      req.params.title.toLowerCase()
    ) {
      result[isbn] = books[isbn];
    }
  });

  return res.json(result);
});

// Task 5: Get book reviews
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({
      message: 'Book not found'
    });
  }

  return res.json(book.reviews);
});

// Tasks 10-13: Asynchronous Axios functions
const BASE_URL = 'http://127.0.0.1:5000';

async function getAllBooks() {
  const response = await axios.get(BASE_URL + '/');
  return response.data;
}

async function getBookByISBN(isbn) {
  const response = await axios.get(
    `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
  );
  return response.data;
}

async function getBooksByAuthor(author) {
  const response = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`
  );
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await axios.get(
    `${BASE_URL}/title/${encodeURIComponent(title)}`
  );
  return response.data;
}

module.exports = {
  general: public_users,
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};
