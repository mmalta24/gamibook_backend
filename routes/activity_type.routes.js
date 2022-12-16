const express = require('express');
let router = express.Router();
const {body, validationResult, param} = require("express-validator");
const {verifyToken} = require("../controllers/auth.controller")
const activityTypeController = require("../controllers/activity_type.controller");


// middleware for all routes related with tutorials
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
});

router.post("/", [
    body("name").trim().notEmpty().withMessage("Insert the activity type name!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, activityTypeController.create);


router.route("/").get(activityTypeController.findAll);


router.delete("/:id", [
    param("id").trim().notEmpty().withMessage("Insert the id!").isNumeric().withMessage("Insert an id!"),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() })
    } else {
        next()
    }
}, verifyToken, activityTypeController.delete);

//send a predefined error message for invalid routes on BOOKS
router.all('*', function (req, res) {
    res.status(404).json({
        message: 'ActivityTypes: what???'
    });
});

// EXPORT ROUTES (required by APP)
module.exports = router;