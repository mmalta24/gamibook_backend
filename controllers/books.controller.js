const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../config/config.js");
const {Op} = require("sequelize");
const db = require("../models");
const Book = db.books;

exports.create = async (req, res) => {
    try {
        let book = await Book.findOne({
            where: {
                name: req.body.name
            }
        }); //get book data from DB
        if (book) return res.status(400).json({
            success: false,
            msg: "Book already exists."
        });
        // Save book to DB
        await Book.create({
            id: req.body.id,
            name: req.body.name,
            img_book: req.body.img_book,
            img_background: req.body.img_background,
            CategoryId: req.body.CategoryId,
        });
        return res.status(201).json({
            success: true,
            msg: "Book was created successfully!",
            uri: `books/${req.body.name}`
        });
    } catch (err) {
        if (err instanceof ValidationError)
        res.status(400).json({
            success: false,
            msg: err.errors.map(e => e.message)
        });
    else
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while creating the book."
        });
    };
}

exports.findOne = async (req, res) => {
    try {
        let book = await Book.findOne({
            where: {
                id: req.params.id
            }
        });

        if (book === null)
            return res.status(404).json({
                success: false,
                msg: `Cannot find the book with id ${req.params.id}.`
            });

        res.status(200).json({
            success: true,
            book: book
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while retrieving the book."
        })
    }
}

exports.findAll = async (req, res) => {
    try {
        let books = await Book.findAll();

        res.status(200).json({
            success: true,
            books: books
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while retrieving the books."
        })
    }
}

exports.update = async (req, res) => {
    try {
        let book = await Book.findOne({
            where: {
                id: req.params.id
            }
        });
        if (book === null)
            return res.status(404).json({
                success: false,
                msg: `Cannot find any book with id ${req.params.id}.`
            });
    
    
        if (!req.body.name && !req.body.img_book && !req.body.img_background && !req.body.CategoryId) {
            return res.status(400).json({
                success: false,
                error: "Update at least one of this items: name, img_book, img_background or CategoryId!",
            });
        }

        const newBook = {
            name: req.body.name,
            img_book: req.body.img_book,
            img_background: req.body.img_background,
            CategoryId: req.body.CategoryId,
        };

        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await Book.update(newBook, { where: { id: req.params.id } })
        
        if (affectedRows[0] === 0) // check if the user was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on book ${req.params.id}.`
            });

        res.json({
            success: true,
            msg: `Book ${req.params.id} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving book ${req.params.id}.`
        });
    };
};

exports.delete = async (req, res) => {
    try {
        let book = await Book.findOne({where: {id: req.params.id}});
        if (book === null)
            return res.status(404).json({
                success: false,
                msg: `Cannot find any book with id ${req.params.id}.`
            });

        let result = await Book.destroy({
            where: {
                id: req.params.id
            }
        })
        // console.log(result)

        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true,
                msg: `The Book with id ${req.params.id} was successfully deleted!`
            });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: `Error deleting book with id ${req.params.id}.`
        });
    };
};
