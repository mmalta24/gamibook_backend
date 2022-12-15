const express = require('express');
const bookModulesController = require("../controllers/book_modules.controller");
const {
    verifyToken
} = require("../controllers/auth.controller")
const {
    body,
    validationResult,
    param
} = require("express-validator");
const activitiesRouter = require("../routes/activities.routes");
// express router
let router = express.Router({
    mergeParams: true
});

router.get("/", [
    param("bookID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an book id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, bookModulesController.findAll);

router.post("/", [
    param("bookID").trim().notEmpty().withMessage("Insert the module name!").isNumeric().withMessage("Insert an id!"),
    body("moduleName").trim().notEmpty().withMessage("Insert the module name!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, bookModulesController.create);

router.delete("/:moduleID", [
    param("bookID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
    param("moduleID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, bookModulesController.delete);

router.patch("/:moduleID", [
    body("moduleName").trim().notEmpty().withMessage("Insert the module name!"),
    param("bookID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
    param("moduleID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, bookModulesController.update);

router.use('/:moduleID/activities', activitiesRouter)
router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({
        message: 'MODULES: what???'
    });
})

module.exports = router;