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
const booksController = require("../controllers/books.controller");

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

// BOOK
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
        verifyToken, booksController.findAllBooks)
    .post([
        body("name").trim().notEmpty().isString().withMessage("Insira o nome do livro!"),
        body("authors").trim().notEmpty().isString().withMessage("Insira o(s) autor(es) do livro!"),
        body("imgBook").trim().notEmpty().isURL().withMessage("Insira a capa do livro!"),
        body("imgBackground").trim().notEmpty().isURL().withMessage("Insira a imagem de fundo!").optional(),
        body("code").isNumeric().withMessage("Insira o código do livro!")
            .isInt({ min: 1000, max: 9999 }).withMessage("O código necessita de ter 4 digitos!"),
        body("CategoryId").isNumeric().withMessage("Insira uma categoria!")
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
        }, verifyToken, booksController.createBook);

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
        }, verifyToken, booksController.findOneBook)
    .patch(
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        body("name").trim().notEmpty().isString().withMessage("Insira o nome do livro!").optional(),
        body("imgBook").trim().notEmpty().isURL().withMessage("Insira a capa do livro!").optional(),
        body("imgBackground").trim().notEmpty().isURL().withMessage("Insira a imagem de fundo!").optional(),
        body("code").isNumeric().withMessage("Insira um código do livro!")
            .isInt({ min: 1000, max: 9999 }).withMessage("O código necessita de ter 4 digitos!").optional(),
        body("CategoryId").isNumeric().withMessage("Insira uma categoria!").optional(),
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, booksController.updateBook)
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
        }, verifyToken, booksController.deleteBook);

// BOOK MODULES
router.route("/:idBook/modules")
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
        }, verifyToken, booksController.findAllBookModules)
    .post([
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        body("moduleName").trim().notEmpty().isString().withMessage("Insira o nome do módulo!"),
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
        }, verifyToken, booksController.createBookModule);

router.route("/:idBook/modules/:idModule")
    .patch([
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        param("idModule").isNumeric().withMessage("Insira um número no id do módulo!"),
        body("moduleName").trim().notEmpty().isString().withMessage("Insira o nome do módulo!")
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
        }, verifyToken, booksController.updateBookModule)
    .delete([
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        param("idModule").isNumeric().withMessage("Insira um número no id do módulo!"),
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
        }, verifyToken, booksController.deleteBookModule);

// BOOK MODULE ACTIVITIES
router.route("/:idBook/modules/:idModule/activities")
    .get([
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        param("idModule").isNumeric().withMessage("Insira um número no id do módulo!"),
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
        }, verifyToken, booksController.findAllBookModuleActivities)
    .post([
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        param("idModule").isNumeric().withMessage("Insira um número no id do módulo!"),
        body("name").trim().notEmpty().isString().withMessage("Insira o nome da atividade!"),
        body("title").trim().notEmpty().isString().withMessage("Insira o enunciado da atividade!"),
        body("question").trim().notEmpty().isString().withMessage("Insira a questão!"),
        body("example").trim().notEmpty().isString().withMessage("Insira um exemplo!").optional(),
        body("options").trim().notEmpty().isString().withMessage("Insira as opções!").optional(),
        body("correctAnswer").trim().notEmpty().isString().withMessage("Insira a opção correta!"),
        body("points").isNumeric().withMessage("Insira a quantidade de pontos!"),
        body("imgBackground").trim().notEmpty().isString().withMessage("Insira a imagem de fundo!").optional(),
        body("ActivityTypeId").isNumeric().withMessage("Insira o tipo de atividade!")
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
        }, verifyToken, booksController.createBookModuleActivity);

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
        }, verifyToken, booksController.findOneBookModuleActivity)
    .patch([
        param("idBook").isNumeric().withMessage("Insira um número no id do livro!"),
        param("idModule").isNumeric().withMessage("Insira um número no id do módulo!"),
        param("idActivity").isNumeric().withMessage("Insira um número no id da atividade!"),
        body("name").trim().notEmpty().isString().withMessage("Insira o nome da atividade!").optional(),
        body("question").trim().notEmpty().isString().withMessage("Insira a questão!").optional(),
        body("example").trim().notEmpty().isString().withMessage("Insira um exemplo!").optional(),
        body("options").trim().notEmpty().isString().withMessage("Insira as opções!").optional(),
        body("correctAnswer").trim().notEmpty().isString().withMessage("Insira as opções!").optional(),
        body("points").isNumeric().withMessage("Insira a quantidade de pontos!").optional(),
        body("imgBackground").trim().notEmpty().isString().withMessage("Insira a imagem de fundo!").optional(),
        body("ActivityTypeId").isNumeric().withMessage("Insira o tipo de atividade!").optional()
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
        }, verifyToken, booksController.updateBookModuleActivity)
    .delete([
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
        }, verifyToken, booksController.deleteBookModuleActivity);

//send a predefined error message for invalid routes
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Books: what???'
    });
});

module.exports = router;