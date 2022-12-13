const express = require('express');
let router = express.Router();
const {body, validationResult} = require("express-validator");
const {verifyToken} = require("../controllers/auth.controller")
const booksController = require("../controllers/books.controller");

// middleware for all routes related with tutorials
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
});

router.post("/create", [
    body("name").trim().notEmpty().withMessage("Insert the book name!"),
    body("img_book").trim().notEmpty().withMessage("Insert the book image!"),
    body("img_background").trim().notEmpty().withMessage("Insert the background image!"),
    body("id").trim().notEmpty().withMessage("Insert the book id!"),
    body("CategoryId").trim().notEmpty().withMessage("Insert the category id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        booksController.create(req, res);
    } else {
        return res.status(400).json({
            errors: errors.array()
        })
    }
});


router.route("/:id")
    .get(verifyToken, booksController.findOne)
    .delete(verifyToken, booksController.delete)
    .patch(verifyToken, booksController.update);
router.route("/").get(booksController.findAll);

//send a predefined error message for invalid routes on BOOKS
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Books: what???'
    });
});

// EXPORT ROUTES (required by APP)
module.exports = router;