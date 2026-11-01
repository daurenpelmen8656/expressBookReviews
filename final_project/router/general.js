const express = require('express');
const axios = require('axios');
const books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Task 10 - Get all books using async/await
public_users.get('/', async function (req, res) {
    try {
        const response = await axios.get('http://localhost:5000/');
        res.send(JSON.stringify(response.data, null, 4));
    } catch (error) {
        res.send(JSON.stringify(books, null, 4));
    }
});

// Task 11 - Get book by ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const getBookByISBN = new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }
    });
    getBookByISBN
        .then((book) => res.send(book))
        .catch((err) => res.status(404).send({ message: err }));
});

// Task 12 - Get books by Author using async/await
public_users.get('/author/:author', async function (req, res) {
    const author = req.params.author;
    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const filteredBooks = Object.values(books).filter(b => b.author === author);
            if (filteredBooks.length > 0) resolve(filteredBooks);
            else reject("No books found");
        });
        const result = await getBooksByAuthor;
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: error });
    }
});

// Task 13 - Get books by Title using async/await
public_users.get('/title/:title', async function (req, res) {
    const title = req.params.title;
    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            const filteredBooks = Object.values(books).filter(b => b.title === title);
            if (filteredBooks.length > 0) resolve(filteredBooks);
            else reject("No books found");
        });
        const result = await getBooksByTitle;
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: error });
    }
});

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) res.send(books[isbn].reviews);
    else res.status(404).send({ message: "Book not found" });
});

public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (!isValid(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

module.exports.general = public_users;