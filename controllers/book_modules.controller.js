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
        
        
        res.status(201).json({
            success: true, msg: `Module added to Book with ID ${req.params.bookID}.`,
            URL: `/books/${req.params.bookID}/modules/${newModule.id}`
        });
    } catch (err) {
        
        console.log(err);
        return res.status(400).send('erro')
    };
}

exports.findAll = async (req, res) => {
    try {
        // try to find the book, given its ID
        let book = await Book.findByPk(req.params.bookID, {
            //include: Module
            include: [{
                model: Module,
                attributes: ['id', 'module_name', 'BookId']
            }]
        })
        if (book === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any book with ID ${req.params.bookID}.`
            });

        res.status(200).json({
            success: true, book: book
        });
    } catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the book."
        })
    }
}

exports.delete = async (req, res) => {
    try {
        let book = await Book.findByPk(req.params.bookID)
        if (book === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any book with ID ${req.params.bookID}.`
            });

        let moduleBook = await Module.findByPk(req.params.moduleID)
        if (moduleBook === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any module with ID ${req.params.moduleID}.`
            });


        let result = await Module.destroy({ where: { id: req.params.moduleID } })
        // console.log(result)

        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true, msg: `Module with id ${req.params.moduleID} was successfully deleted!`
            });
        // no rows deleted -> no book was found
        res.status(404).json({
            success: false, msg: `Cannot find any book module with ID ${req.params.moduleID}.`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, msg: `Error deleting book module with ID ${req.params.moduleID}.`
        });
    };
};

exports.update = async (req, res) => {
    try {
        // since Sequelize update() does not distinguish if a book exists, first let's try to find one
        let book = await Book.findByPk(req.params.bookID);
        if (book === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any book with ID ${req.params.bookID}.`
            });

        let moduleBook = await Module.findByPk(req.params.moduleID)
        if (moduleBook === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any module with ID ${req.params.moduleID}.`
            });

        if (!req.body.moduleName) {
            return res.status(404).json({
                success: false, msg: `No module name found.`
            });
        }
        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await Module.update({ module_name: req.body.moduleName }, { where: { id: req.params.moduleID } })
        console.log(affectedRows)
        if (affectedRows[0] === 0) // check if the book was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on module with ID ${req.params.moduleID}.`
            });

        res.json({
            success: true,
            msg: `Module with ID ${req.params.moduleID} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving module with ID ${req.params.moduleID}.`
        });
    };
};