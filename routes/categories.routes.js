const express = require('express');
let router = express.Router();
const {body, validationResult} = require("express-validator");
const {verifyToken} = require("../controllers/auth.controller")
const categoriesController = require("../controllers/categories.controller");

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
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        categoriesController.create(req, res);
    } else {
        return res.status(400).json({
            errors: errors.array()
        })
    }
});


router.route("/:id")
    .delete(verifyToken, categoriesController.delete)
    .patch(categoriesController.update);
router.route("/").get(categoriesController.findAll);

//send a predefined error message for invalid routes on BOOKS
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Categories: what???'
    });
});

// EXPORT ROUTES (required by APP)
module.exports = router;