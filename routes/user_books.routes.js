const express = require('express');
let router = express.Router();
const {
    body,
    param,
    query,
    validationResult
} = require("express-validator");
const {
    verifyToken
} = require("../controllers/auth.controller");
const userBooksController = require("../controllers/user_books.controller");

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
    .get(
        [query("category").isNumeric().withMessage("Insira uma categoria!").optional()],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        },
        verifyToken, userBooksController.findAllBooks)
    .post(
        [body("code").isNumeric().withMessage("Insira um código do livro!").isInt({ min: 1000, max: 9999 })
            .withMessage("O código necessita de ter 4 digitos!")
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
        }, verifyToken, userBooksController.createBook);

router.route("/:idBook")
    .get(
        [param("idBook").isNumeric().withMessage("Insira um número no id do livro!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, userBooksController.findOneBook)
    .patch(
        [param("idBook").isNumeric().withMessage("Insira um número no id do livro!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, userBooksController.updateBook)
    .delete(
        [param("idBook").isNumeric().withMessage("Insira um número no id do livro!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, userBooksController.deleteBook);

router.route("/:idBook/modules/:idModule/activities/:idActivity")
    .get([
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        param("idModule").isNumeric().withMessage("Insira um número no id do módulo!"),
        param("idActivity").isNumeric().withMessage("Insira um número no id da atividade!"),
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
        }, verifyToken, userBooksController.findOneBookModuleActivity)
    .patch([
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        param("idModule").isNumeric().withMessage("Insira um número no id do módulo!"),
        param("idActivity").isNumeric().withMessage("Insira um número no id da atividade!"),
        body("answers").trim().notEmpty().isString().withMessage("Insira uma resposta!")
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
        }, verifyToken, userBooksController.updateBookModuleActivity);

//send a predefined error message for invalid routes
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'MyBooks: what???'
    });
});

module.exports = router;