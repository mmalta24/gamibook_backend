const express = require('express');
let router = express.Router();
const {
    body,
    validationResult,
    oneOf,
} = require("express-validator");
const {
    verifyToken
} = require("../controllers/auth.controller")
const usersController = require("../controllers/users.controller");

// middleware for all routes related with tutorials
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
});

router.post("/register", [
    body("username").trim().notEmpty().withMessage("Insira um username!"),
    body("password").trim().notEmpty().withMessage("Insira uma password!"),
    body("fullName").trim().notEmpty().withMessage("Insira o seu nome!"),
    body("email").trim().notEmpty().withMessage("Insira um email!").isEmail().withMessage("Insira um email válido!"),
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        usersController.register(req, res);
    } else {
        return res.status(400).json({
            errors: errors.array()
        })
    }
});

router.post("/login", [
    body("username").trim().notEmpty().withMessage("Insira um username!"),
    body("password").trim().notEmpty().withMessage("Insira uma password!"),
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        usersController.login(req, res);
    } else {
        return res.status(400).json({
            errors: errors.array()
        })
    }
});

router.route("/me")
    .get(verifyToken, usersController.getUser)
    .patch([oneOf( // one of the following must exist
            [
                body("password").trim().notEmpty().withMessage("Insira um password!"),
                body("avatar").trim().notEmpty().withMessage("Insira um avatar!"),
            ],
        )], function (req, res, next) {
            const errors = validationResult(req);
            if (errors.isEmpty()) {
                next();
            } else {
                return res.status(400).json({
                    errors: errors.array()
                });
            }
        },
        verifyToken, usersController.updateUser);

/*
router.route("/me/achievements").get(verifyToken, usersController.getUserAchievements);
router.route("/me/notifications").get(verifyToken, usersController.getUserNotifications);
router.route("/me/notifications/:notificationId").get(verifyToken, usersController.deleteNotification);
router.route("/me/books").get(verifyToken, usersController.getUserBooks).post(verifyToken, usersController.addBook);
router.route("/me/books/:bookId").delete(verifyToken, usersController.deleteBook);
 */

//send a predefined error message for invalid routes
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Users: what???'
    });
});

module.exports = router;