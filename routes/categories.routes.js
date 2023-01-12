const express = require('express');
let router = express.Router();
const {
    body,
    param,
    validationResult
} = require("express-validator");
const {
    verifyToken
} = require("../controllers/auth.controller");
const categoriesController = require("../controllers/categories.controller");

router.use((req, res, next) => {
    const start = Date.now();
    //compare a start time to an end time and figure out how many seconds elapsed
    res.on("finish", () => {
        // the finish event is emitted once the response has been sent to the client
        const diffSeconds = (Date.now() - start) / 1000;
        console.log(
            `${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`
        );
    });
    next();
});

router.route("/")
    .get(verifyToken, categoriesController.findAllCategories)
    .post(
        [body("name").trim().notEmpty().withMessage("Insira o nome da categoria!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, categoriesController.createCategory);

router.route("/:idCategory")
    .patch([
        param("idCategory").isNumeric().withMessage("Insira um número no id da categoria!"),
        body("name").trim().notEmpty().withMessage("Insira o nome da categoria!")
    ],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, categoriesController.updateCategory)
    .delete([param("idCategory").isNumeric().withMessage("Insira um número no id da categoria!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, categoriesController.deleteCategory);

//send a predefined error message for invalid routes
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Categories: what???'
    });
});

module.exports = router;