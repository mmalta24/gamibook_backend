const express = require('express');
let router = express.Router();
const {
    body,
    validationResult
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
    body("full_name").trim().notEmpty().withMessage("Insira o seu nome!"),
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

router.route("/me").get(verifyToken, usersController.getUser);

//send a predefined error message for invalid routes on TUTORIALS
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Users: what???'
    });
});

// EXPORT ROUTES (required by APP)
module.exports = router;