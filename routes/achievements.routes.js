const express = require('express');
let router = express.Router();
const { body, validationResult, param} = require("express-validator");
const { verifyToken } = require("../controllers/auth.controller")
const achievementsController = require("../controllers/achievements.controller");

//create achievement

router.post("/create", [
    body("name").trim().notEmpty().isString().withMessage("Insira um nome para a conquista!"),
    body("description").trim().notEmpty().isString().withMessage("Insira uma descrição para a conquista!"),
    body("points_needed").trim().notEmpty().isNumeric().withMessage("Insira o número de pontos necessários!"),
    body("img").trim().notEmpty().isString().withMessage("Insira a imagem da consquista!")
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    }
    else {
        next()
    }
}, verifyToken, achievementsController.create);

//get all achievements

router.get("/", [],(req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    }
    else {
        next()
    }
}, verifyToken, achievementsController.findAll)


//get by id achievement
router.get("/:idAchievement", [
    param("idAchievement").trim().notEmpty().isNumeric().withMessage("É necessário o ID da conquista!"),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    }
    else {
        next()
    }
}, verifyToken, achievementsController.findByPk);


//update achievement
router.patch("/:idAchievement", [
    param("idAchievement").trim().notEmpty().isNumeric().withMessage("É necessário o ID da conquista para atualizá-la!"),
    body("name").trim().notEmpty().isString().withMessage("Insira um nome para a conquista!").optional(),
    body("description").trim().notEmpty().isString().withMessage("Insira uma descrição para a conquista!").optional(),
    body("points_needed").trim().notEmpty().isNumeric().withMessage("Insira o número de pontos necessários!").optional(),
    body("img").trim().notEmpty().isString().withMessage("Insira a imagem da consquista!").optional()
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    }
    else {
        next()
    }
}, verifyToken, achievementsController.updateAchievement)

//delete achievement
router.delete("/:idAchievement", [
    param("idAchievement").trim().notEmpty().isNumeric().withMessage("É necessário o ID da conquista!"),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    }
    else {
        next()
    }
}, verifyToken, achievementsController.deleteAchievement);

// EXPORT ROUTES (required by APP)
module.exports = router;