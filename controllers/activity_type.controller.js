const db = require("../models");
const ActivityType = db.activity_type;

exports.create = async (req, res) => {
    try {
        let activityType = await ActivityType.findOne({
            where: {
                name: req.body.name
            }
        }); //get ActivityType data from DB
        if (activityType) return res.status(400).json({
            success: false,
            msg: "This activity type already exists."
        });
        // Save ActivityType to DB
        await ActivityType.create({
            name: req.body.name,
        });
        return res.status(201).json({
            success: true,
            msg: "Activity type was created successfully!",
            uri: `activityTypes/${req.body.name}`
        });
    } catch (err) {
        if (err instanceof ValidationError)
        res.status(400).json({
            success: false,
            msg: err.errors.map(e => e.message)
        });
    else
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while creating the activity type."
        });
    };
}

exports.findAll = async (req, res) => {
    try {
        let activityTypes = await ActivityType.findAll();

        res.status(200).json({
            success: true,
            activityTypes: activityTypes
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while retrieving the activity types."
        })
    }
}

exports.delete = async (req, res) => {
    try {
        let activityType = await ActivityType.findOne({where: {id: req.params.id}});
        if (activityType === null)
            return res.status(404).json({
                success: false,
                msg: `Cannot find any activity type with id ${req.params.id}.`
            });

        let result = await ActivityType.destroy({
            where: {
                id: req.params.id
            }
        })
        // console.log(result)

        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true,
                msg: `The activity type with id ${req.params.id} was successfully deleted!`
            });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: `Error deleting activity type with id ${req.params.id}.`
        });
    };
};