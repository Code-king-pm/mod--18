import type { User } from '../models/User.js';
import type { Book } from '../models/Book.js';

// Route to get logged in user's info (needs the token)
export const getMe = (token: string) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

// Function to create a new user
export const createUser = (userData: User) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// Function to log in a user
export const loginUser = (userData: User) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// Function to save book data for a logged in user
export const saveBook = (bookData: Book, token: string) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
};

// Function to remove saved book data for a logged in user
export const deleteBook = (bookId: string, token: string) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

// Function to make a search to Google Books API
export const searchGoogleBooks = (query: string) => {
  const formattedQuery = encodeURIComponent(query); // Properly encode the query
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${formattedQuery}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
