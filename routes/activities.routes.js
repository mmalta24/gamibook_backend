const express = require('express');
const activityController = require("../controllers/activities.controller");
const {
    verifyToken
} = require("../controllers/auth.controller")
const {
    body,
    validationResult,
    param
} = require("express-validator");

// express router
let router = express.Router({
    mergeParams: true
});


router.post("/", [
    param("bookID").trim().notEmpty().withMessage("Insert the book id!").isNumeric().withMessage("Insert an id!"),
    param("moduleID").trim().notEmpty().withMessage("Insert the module id!").isNumeric().withMessage("Insert an id!"),
    param("bookID").trim().notEmpty().withMessage("Insert the book id!").isNumeric().withMessage("Insert an id!"),
    body("name").trim().notEmpty(),
    body("question").trim().notEmpty(),
    body("options").trim().notEmpty(),
    body("correct_answer").trim().notEmpty(),
    body("points").trim().notEmpty().isNumeric().withMessage("Insert a number!"),
    body("img_background").trim().notEmpty(),
    body("ActivityTypeId").trim().notEmpty().isNumeric().withMessage("Insert a number!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, activityController.create);


router.get("/", [
    param("moduleID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an book id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, activityController.findAll);

router.delete("/:activityID", [
    param("bookID").trim().notEmpty().withMessage("Insert the book id!").isNumeric().withMessage("Insert an id!"),
    param("moduleID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an book id!"),
    param("activityID").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an activity id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, activityController.delete);

router.patch("/:activityID", [
    param("bookID").trim().notEmpty().withMessage("Insert the book id!").isNumeric().withMessage("Insert an id!"),
    param("moduleID").trim().notEmpty().withMessage("Insert the module id!").isNumeric().withMessage("Insert an id!"),
    param("activityID").trim().notEmpty().withMessage("Insert the module id!").isNumeric().withMessage("Insert an id!"),
    param("bookID").trim().notEmpty().withMessage("Insert the book id!").isNumeric().withMessage("Insert an id!"),
    body("name").trim().optional(),
    body("question").trim().optional(),
    body("options").trim().optional(),
    body("correct_answer").trim().optional(),
    body("points").trim().optional().isNumeric().withMessage("Insert a number!"),
    body("img_background").trim().optional(),
    body("ActivityTypeId").trim().optional().isNumeric().withMessage("Insert a number!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, activityController.update);

router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({
        message: 'ACTIVITIES: what???'
    });
})

module.exports = router;