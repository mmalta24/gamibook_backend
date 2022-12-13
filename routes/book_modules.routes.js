const express = require('express');
const bookModulesController = require("../controllers/book_modules.controller");


// express router
let router = express.Router({ mergeParams: true });

router.route('/')
    .post(bookModulesController.create);


router.all('*', function (req, res) {
    //send an predefined error message 
    res.status(404).json({ message: 'MODULES: what???' });
})

module.exports = router;    