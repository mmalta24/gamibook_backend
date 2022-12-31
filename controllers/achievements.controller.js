const {
    ValidationError
} = require("sequelize");
const {
    cleanEmptyObjectKeys,
    trimObjectStrings
} = require("../utilities");
const db = require("../models");
const Achievement = db.achievements;
const User = db.users;

exports.findAllAchievements = async (req, res) => {
    try {
        if (req.typeUser === "admin") {
            const achievements = await Achievement.findAll();

            return res.status(200).json({
                success: true,
                achievements
            });
        }

        // regular user
        const achievementsList = await Achievement.findAll();

        const user = await User.findByPk(req.userId);

        const userAchievements = await user.getAchievements();

        let achievements = [];

        for (const achievement of achievementsList) {
            const owned = userAchievements.some(userAchiev => userAchiev.id === achievement.id);

            achievements.push({
                ...achievement.dataValues,
                owned
            });
        }

        return res.status(200).json({
            success: true,
            achievements
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter as conquistas. Tente novamente!"
        });
    }
}

exports.createAchievement = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para criar conquistas!",
        });
    }

    try {
        const achievement = await Achievement.findOne({
            where: trimObjectStrings({
                name: req.body.name
            })
        });

        if (achievement) {
            return res.status(406).json({
                success: false,
                msg: "Já existe uma conquista com esse nome!"
            });
        }

        const newAchievement = await Achievement.create(trimObjectStrings(req.body));

        return res.status(201).json({
            success: true,
            msg: "Conquista criada!",
            uri: `/achievements/${newAchievement.id}`
        });
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                msg: err.errors.map(e => e.message)
            });
        }
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao criar a conquista. Tente novamente!"
        });
    }
}

exports.findOneAchievement = async (req, res) => {
    try {
        const achievement = await Achievement.findByPk(req.params.idAchievement);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                msg: "Conquista não encontrada!"
            });
        }

        if (req.typeUser === "admin") {
            return res.status(200).json({
                success: true,
                achievement
            });
        }

        // regular user
        const user = await User.findByPk(req.userId);

        const userAchievements = await user.getAchievements();

        const owned = userAchievements.some(userAchiev => userAchiev.id === +req.params.idAchievement);

        return res.status(200).json({
            success: true,
            achievement: {
                ...achievement.dataValues,
                owned
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter as conquistas. Tente novamente!"
        });
    }
}

exports.updateAchievement = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar conquistas!",
        });
    }
    try {
        const achievement = await Achievement.findByPk(req.params.idAchievement);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                msg: "Conquista não encontrada!"
            });
        }

        const data = cleanEmptyObjectKeys(trimObjectStrings(req.body));

        if (data.name) {
            const achievementFind = await Achievement.findOne({
                where: {
                    name: data.name
                }
            });

            if (achievementFind) {
                return res.status(406).json({
                    success: false,
                    msg: "Já existe uma conquista com esse nome!"
                });
            }
        }


        await Achievement.update(data, {
            where: {
                id: req.params.idAchievement
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Conquista atualizada!"
        });
    } catch (err) {
        if (err instanceof ValidationError) {
            return res.status(400).json({
                success: false,
                msg: err.errors.map(e => e.message)
            });
        }
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao atualizar a conquista. Tente novamente!"
        });
    }
}

exports.deleteAchievement = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para apagar conquistas!",
        });
    }
    try {
        const achievement = await Achievement.findByPk(req.params.idAchievement);

        if (!achievement) {
            return res.status(404).json({
                success: false,
                msg: "Conquista não encontrada!"
            });
        }

        await Achievement.destroy({
            where: {
                id: req.params.idAchievement
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Conquista apagada!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao apagar a conquista. Tente novamente!"
        });
    }
}