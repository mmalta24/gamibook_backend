const express = require('express');
let router = express.Router();
const {
    body,
    param,
    validationResult,
    oneOf
} = require("express-validator");
const {
    verifyToken
} = require("../controllers/auth.controller");
const usersController = require("../controllers/users.controller");

// middleware for all routes
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
});

router.route("/")
    .get(verifyToken, usersController.findAllUsers)
    .post([
        body("username").trim().notEmpty().withMessage("Insira um username!"),
        body("password").trim().notEmpty().withMessage("Insira uma password!"),
        body("fullName").trim().notEmpty().withMessage("Insira o seu nome!"),
        body("email").trim().notEmpty().withMessage("Insira um email!").isEmail().withMessage("Insira um email válido!"),
    ], function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        } else {
            next();
        }
    }, verifyToken, usersController.createAdminUser);

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
        });
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
        });
    }
});

router.route("/me")
    .get(verifyToken, usersController.getProfile)
    .patch([oneOf( // one of the following must exist
        [
            body("password").trim().notEmpty().withMessage("Insira uma password!"),
            body("avatar").notEmpty().withMessage("Insira um avatar!"), // it can be emppty since user can use level avatar
            body("tickets").notEmpty().withMessage("Insira um número de bilhetes!"),
            body("points").notEmpty().withMessage("Insira um número de pontos!")
        ],
    )], function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        } else {
            next();
        }
    },
        verifyToken, usersController.updateProfile);

router.route("/me/notifications")
    .get(verifyToken, usersController.findProfileNotifications);

router.route("/me/notifications/:notificationId")
    .delete(
        [param("notificationId").isNumeric().withMessage("Insira um número no id da notificação!")],
        function (req, res, next) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, usersController.deleteProfileNotification);

router.route("/:idUser")
    .get(
        [param("idUser").isNumeric().withMessage("Insira um número no id do utilizador!")],
        function (req, res, next) {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, usersController.findOneUser);

//send a predefined error message for invalid routes
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Users: what???'
    });
});

module.exports = router;