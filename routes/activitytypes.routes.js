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
const activityTypesController = require("../controllers/activityTypes.controller");

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
    .get(verifyToken, activityTypesController.findAllTypes)
    .post(
        [body("name").trim().notEmpty().isString().withMessage("Insira o nome do tipo de atividade!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, activityTypesController.createType);

router.route("/:idType")
    .patch([
            param("idType").isNumeric().withMessage("Insira um número no id do tipo de atividade!"),
            body("name").trim().notEmpty().isString().withMessage("Insira o nome do tipo de atividade!")
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
        }, verifyToken, activityTypesController.updateType)
    .delete(
        [param("idType").isNumeric().withMessage("Insira um número no id do tipo de atividade!")],
        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array()
                });
            } else {
                next();
            }
        }, verifyToken, activityTypesController.deleteType);

//send a predefined error message for invalid routes
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'Activity Types: what???'
    });
});

module.exports = router;