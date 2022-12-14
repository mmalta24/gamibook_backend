const express = require('express');
const bookModulesController = require("../controllers/book_modules.controller");
const {body, validationResult, param} = require("express-validator");
// express router
let router = express.Router({
    mergeParams: true
});

router.route('/')
    .get(bookModulesController.findAll);

router.post("/", [
    body("moduleName").trim().notEmpty().withMessage("Insert the module name!"),
    param("bookID").trim().notEmpty().withMessage("Insert the module name!").isNumeric().withMessage("Insert an id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        bookModulesController.create(req, res);
    } else {
        return res.status(400).json({
            errors: errors.array()
        })
    }
});

router.delete("/:idModule", [
    param("bookID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
    param("idModule").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        bookModulesController.delete(req, res);
    } else {
        return res.status(400).json({
            errors: errors.array()
        })
    }
});

router.patch("/:idModule", [
    body("moduleName").trim().notEmpty().withMessage("Insert the module name!"),
    param("bookID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
    param("idModule").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        bookModulesController.update(req, res);
    } else {
        return res.status(400).json({
            errors: errors.array()
        })
    }
});

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({
        message: 'MODULES: what???'
    });
})

module.exports = router;