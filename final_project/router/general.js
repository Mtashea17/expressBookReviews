const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => { 
    // Take 'username' and 'password' from request body
    const { username, password } = req.body;
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }
    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(409).json({ message: "Username already exists." });
    }
    // Register new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully." });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    // Send a JSON response with all book data, formatted neatly
    return res.status(200).json({ books: JSON.stringify(books, null, 2) });
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    // Retrieve book details for a specific ISBN and send the corresponding book information as the response
    const isbn = req.params.isbn;
    res.send(books[isbn]);
    return res.status(300).json({message: "The Book Details"});
   });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    // Obtain all the keys for the 'books' object
    const author = req.params.author;
    const matchingBooks = {};
    Object.keys(books).forEach((key) => {
      if (books[key].author && books[key].author.toLowerCase() === author.toLowerCase()) {
        matchingBooks[key] = books[key];
      }
    });
    if (Object.keys(matchingBooks).length > 0) {
      return res.status(200).json({ books: matchingBooks });
    } else {
      return res.status(404).json({ message: "No books found for the given author." });
    }
  });

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    // Extract the title from the request parameters
    const title = req.params.title;
    // Filter the books details based on the provided title (case-insensitive)
    let filteredBooks = books.filter((book) => book.title.toLowerCase() === title.toLowerCase());
    // Send the filtered books based on title as the response to the client
    return res.status(300).json({message: "Titles of the Book " + JSON.stringify(filteredBooks, null, 2)});
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    // Get the book reviews based on ISBN provided in the request parameters
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book && book.reviews) {
      return res.status(200).json({ reviews: book.reviews });
    } else {
      return res.status(404).json({ message: "No reviews found for the given ISBN." });
    }
  });

module.exports.general = public_users;
