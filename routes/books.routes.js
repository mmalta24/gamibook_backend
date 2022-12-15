const express = require('express');
let router = express.Router();
const {
    body,
    validationResult,
    param
} = require("express-validator");
const {
    verifyToken
} = require("../controllers/auth.controller")
const booksController = require("../controllers/books.controller");
const modulesRouter = require("../routes/book_modules.routes");

// middleware for all routes related with tutorials
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
});

// CREATE BOOK
router.post("/create", [
    body("id").trim().notEmpty().withMessage("Insert the book id!"),
    body("name").trim().notEmpty().withMessage("Insert the book name!"),
    body("img_book").trim().notEmpty().withMessage("Insert the book image!"),
    body("img_background").trim().notEmpty().withMessage("Insert the background image!"),
    body("CategoryId").trim().notEmpty().withMessage("Insert the category id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, booksController.create);


router.use('/:bookID/modules', modulesRouter)

// GET BOOK GIVEN IS ID
router.get("/:id", [
    param("id").trim().notEmpty().withMessage("Insert the book id!").isNumeric(),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, booksController.findOne);

// UPDATE BOOK GIVEN IS ID
router.patch("/:id", [
    param("id").trim().notEmpty().withMessage("Insert the book id!").isNumeric(),
], function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, booksController.update);


// DELETE BOOK GIVEN IS ID
router.delete("/:id", [
    param("id").trim().notEmpty().withMessage("Insert the book id!").isNumeric(),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, booksController.update);

// GET ALL BOOKS
router.route("/").get(booksController.findAll);

//send a predefined error message for invalid routes on BOOKS
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'BOOKS: what???'
    });
});

// EXPORT ROUTES (required by APP)
module.exports = router;