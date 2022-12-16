const db = require("../models");
const Activity = db.activity; const Module = db.book_modules;


exports.create = async (req, res) => {
    try {
        // try to find the module, given its ID
        let moduleBook = await Module.findByPk(req.params.moduleID)
        if (moduleBook === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any module with ID ${req.params.moduleID}.`
            });
        // save Module in the database
        let newActivity = await Activity.create(
            {
                name: req.body.name,
                question: req.body.question,
                options: req.body.options,
                correct_answer: req.body.correct_answer,
                points: req.body.points,
                img_background: req.body.img_background,
                BookModuleId: req.params.moduleID,
                ActivityTypeId: req.body.ActivityTypeId,
            }
        )
        
        res.status(201).json({
            success: true, msg: `Activity added to module with ID ${req.params.moduleID}.`,
            URL: `/modules/${req.params.moduleID}/activities/${newActivity.id}`
        });
    } catch (err) {
        console.log(err);
        return res.status(400).send('Error')
    };
}

exports.findAll = async (req, res) => {
    try {
        // try to find the module, given its ID
        let moduleBook = await Module.findByPk(req.params.moduleID, {
            //include: Activity
            include: [{
                model: Activity,
                attributes: ['id', 'name', 'question', 'options', 'correct_answer', 'points', 'img_background', 'BookModuleId', 'ActivityTypeId']
            }]
        })
        if (moduleBook === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any module with ID ${req.params.idModule}.`
            });

        res.status(200).json({
            success: true, moduleBook: moduleBook
        });
    } catch (err) {
        res.status(500).json({
            success: false, msg: err.message || "Some error occurred while retrieving the module book."
        })
    }
}

exports.delete = async (req, res) => {
    try {
        let moduleBook = await Module.findByPk(req.params.moduleID)
        if (moduleBook === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any book with ID ${req.params.bookID}.`
            });

        let activity = await Activity.findByPk(req.params.activityID)
        if (activity === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any activity with ID ${req.params.activityID}.`
            });


        let result = await Activity.destroy({ where: { id: req.params.activityID } })

        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true, msg: `Activity with id ${req.params.activityID} was successfully deleted!`
            });
        // no rows deleted -> no book was found
        res.status(404).json({
            success: false, msg: `Cannot find any activity with ID ${req.params.activityID}.`
        });
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            success: false, msg: `Error deleting activity with ID ${req.params.activityID}.`
        });
    };
};

exports.update = async (req, res) => {
    try {
        // since Sequelize update() does not distinguish if a book exists, first let's try to find one
        let moduleBook = await Module.findByPk(req.params.moduleID);
        if (moduleBook === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any book module with ID ${req.params.moduleID}.`
            });

        let activity = await Activity.findByPk(req.params.activityID)
        if (activity === null)
            return res.status(404).json({
                success: false, msg: `Cannot find any activity with ID ${req.params.activityID}.`
            });

        // obtains only a single entry from the table, using the provided primary key
        let affectedRows = await Activity.update(
            {
                name: req.body.name,
                question: req.body.question,
                options: req.body.options,
                correct_answer: req.body.correct_answer,
                points: req.body.points,
                img_background: req.body.imgBackground,
                ActivityTypeId: req.body.ActivityTypeId
            }
            , { where: { id: req.params.activityID } })


        console.log(affectedRows)
        if (affectedRows[0] === 0) // check if the book was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on activity with ID ${req.params.activityID}.`
            });

        res.json({
            success: true,
            msg: `Activity with ID ${req.params.activityID} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error retrieving activity with ID ${req.params.activityID}.`
        });
    };
};