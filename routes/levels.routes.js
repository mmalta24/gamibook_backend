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
const levelsController = require("../controllers/levels.controller");

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
    .get(verifyToken, levelsController.findAllLevels)
    .post([
            body("points").isNumeric().withMessage("Insira o número de pontos necessários!"),
            body("profileImage").trim().notEmpty().isURL().withMessage("Insira a imagem da consquista!")
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
        }, verifyToken, levelsController.createLevel);

router.route("/:idLevel")
    .get(
        [param("idLevel").isNumeric().withMessage("Insira um número no id do nível!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, levelsController.findOneLevelRanking)
    .patch([
            param("idLevel").isNumeric().withMessage("Insira um número no id do nível!"),
            body("points").isNumeric().withMessage("Insira o número de pontos necessários!").optional(),
            body("profileImage").trim().notEmpty().isURL().withMessage("Insira um URL com a imagem do nível!").optional()
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
        }, verifyToken, levelsController.updateLevel);

//send a predefined error message for invalid routes
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Levels: what???'
    });
});

module.exports = router;