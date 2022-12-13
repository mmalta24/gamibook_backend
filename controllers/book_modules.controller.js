const db = require("../models/index.js");
const Book = db.books; const Module = db.book_modules;


exports.create = async (req, res) => {
    try {
        // try to find the book, given its ID
        let book = await Book.findByPk(req.params.bookID)
        if (book === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any book with ID ${req.params.bookID}.`
            });
        // save Module in the database
        let newModule = await Module.create({module_name: req.body.moduleName, BookId: req.params.bookID})


        // add module to found book (using a mixin)
        // ERROR
        
        await book.addModule(newModule);
        
        
        res.status(201).json({
            success: true, msg: `Module added to Book with ID ${req.params.bookID}.`,
            URL: `/books/${req.params.bookID}/modules/${newModule.id}`
        });
    } catch (err) {
        // console.log(err.name) // err.name === 'SequelizeValidationError'
        if (err instanceof ValidationError)
            res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        else
            res.status(500).json({
                success: false, msg: err.message || "Some error occurred while creating the tutorial."
            });
    };
}
