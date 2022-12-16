const db = require("../models");
const Achievements = db.achievements;
const { ValidationError } = require("sequelize");

exports.create = async (req, res) => {
    try {
        // Save category to DB
        let newAchievement = await Achievements.create({
            name: req.body.name,
            description: req.body.description,
            points_needed: req.body.points_needed,
            img: req.body.img
        });
        return res.status(201).json({
            success: true,
            msg: "Achievement was created successfully!",
            uri: `achievements/${newAchievement.id}`
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
                msg: err.message || "Some error occurred while creating the achievement."
            });
    };
}


exports.findAll = async (req, res) => {
    try {
        let achievements = await Achievements.findAll();

        res.status(200).json({
            success: true,
            achievements: achievements
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || "Some error occurred while retrieving the achievements."
        })
    }
}

exports.findByPk = async (req, res) => {
    try {
        let achievement = await Achievements.findByPk(req.params.idAchievement);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                msg: `Cannot find any achievement with id ${req.params.idAchievement}.`
            });

        }

        res.status(200).json({
            success: true,
            achievement: achievement
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            msg: err.message || `Some error occurred while retrieving the achievement with id:${req.params.idAchievement}.`
        })
    }
}

exports.updateAchievement = async (req, res) => {
    try {
        let achievement = await Achievements.findByPk(req.params.idAchievement)
        console.log(achievement);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                msg: `Cannot find any achievement with id ${req.params.idAchievement}.`
            });

        }

        const newData = { name: req.body.name, description: req.body.description, points_needed: req.body.points_needed, img: req.body.img }

        Object.keys(newData).forEach(key => {
            if (newData[key] === null) {
                delete newData[key];
            }
        });

        if(newData==={}){
            return res.status(400).json({success:false,msg:"You don't have data to update achievement!"})
        }

        // update only a single entry from the table, using the provided primary key
        let affectedRows = await Achievements.update(newData, { where: { id: req.params.idAchievement } })

        if (affectedRows[0] === 0) // check if the achievement was updated (returns [0] if no data was updated)
            return res.status(200).json({
                success: true, msg: `No updates were made on achievements ${req.params.idAchievement}.`
            });

        res.json({
            success: true,
            msg: `Achievement ${req.params.idAchievement} was updated successfully.`
        });
    }
    catch (err) {
        if (err instanceof ValidationError)
            return res.status(400).json({ success: false, msg: err.errors.map(e => e.message) });
        res.status(500).json({
            success: false, msg: `Error update achievement ${req.params.idAchievement}.`
        });
    };
};


exports.deleteAchievement = async (req, res) => {
    try {
        let achievement = await Achievements.findByPk(req.params.idAchievement);
        if (!achievement)
            return res.status(404).json({
                success: false,
                msg: `Cannot find any achievement with id ${req.params.idAchievement}.`
            });

        let result = await Achievements.destroy({
            where: {
                id: req.params.idAchievement
            }
        })

        if (result == 1) // the promise returns the number of deleted rows
            return res.status(200).json({
                success: true,
                msg: `The achievement with id ${req.params.idAchievement} was successfully deleted!`
            });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            success: false,
            msg: `Error deleting achievement with id ${req.params.idAchievement}.`
        });
    };
};