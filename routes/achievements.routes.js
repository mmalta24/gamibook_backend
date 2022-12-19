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
const achievementsController = require("../controllers/achievements.controller");

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
    .get(verifyToken, achievementsController.findAllAchievements)
    .post([
        body("name").trim().notEmpty().isString().withMessage("Insira um nome para a conquista!"),
        body("description").trim().notEmpty().isString().withMessage("Insira uma descrição para a conquista!"),
        body("pointsNeeded").isNumeric().withMessage("Insira o número de pontos necessários!"),
        body("img").trim().notEmpty().isString().withMessage("Insira a imagem da consquista!")
    ], (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        } else {
            next();
        }
    }, verifyToken, achievementsController.createAchievement);

router.route("/:idAchievement")
    .get(
        [param("idAchievement").isNumeric().withMessage("Insira um número no id da conquista!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, achievementsController.findOneAchievement)
    .patch(
        [
            param("idAchievement").isNumeric().withMessage("Insira um número no id da conquista!"),
            body("name").trim().notEmpty().isString().withMessage("Insira um nome para a conquista!").optional(),
            body("description").trim().notEmpty().isString().withMessage("Insira uma descrição para a conquista!").optional(),
            body("pointsNeeded").isNumeric().withMessage("Insira o número de pontos necessários!").optional(),
            body("img").trim().notEmpty().isURL().withMessage("Insira a imagem da consquista!").optional()
        ], (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, achievementsController.updateAchievement)
    .delete(
        [param("idAchievement").isNumeric().withMessage("Insira um número no id da conquista!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, achievementsController.deleteAchievement);

//send a predefined error message for invalid routes
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Achievements: what???'
    });
});

module.exports = router;