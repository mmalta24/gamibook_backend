const {
    ValidationError
} = require("sequelize");
const {
    cleanEmptyObjectKeys,
    trimObjectStrings
} = require("../utilities");
const db = require("../models");
const Level = db.levels;
const User = db.users;

exports.findAllLevels = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver todos os níveis!"
        });
    }

    try {
        const levels = await Level.findAll();

        return res.status(200).json({
            success: true,
            levels
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter os níveis. Tente novamente!"
        });
    }
}

exports.createLevel = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para criar níveis!",
        });
    }

    try {
        const levels = await Level.findAll();

        const lastLevelAdded = levels[levels.length - 1].dataValues;

        if (lastLevelAdded.points >= req.body.points) {
            return res.status(400).json({
                success: false,
                msg: "O novo nível não pode ter menor ou igual pontuação que o nível anterior!",
            });
        }

        const newLevel = await Level.create(trimObjectStrings(req.body));

        return res.status(200).json({
            success: true,
            msg: "Nível criado!",
            uri: `/levels/${newLevel.id}`
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
            msg: err.message || "Ocorreu um erro ao criar o nível. Tente novamente!"
        });
    }
}

exports.findOneLevelRanking = async (req, res) => {
    try {
        if (req.typeUser === "admin") {
            const users = await User.findAll({
                where: {
                    LevelId: req.params.idLevel
                }
            });

            const level = await Level.findByPk(req.params.idLevel);

            let ranking = [];

            for (const user of users) {
                ranking.push({
                    id: user.id,
                    username: user.username,
                    totalPoints: user.totalPoints,
                    lastRanking: user.lastRanking,
                    avatar: user.avatar ? user.avatar : level.profileImage
                })
            }

            return res.status(200).json({
                success: true,
                ranking: ranking.sort((a, b) => b.totalPoints - a.totalPoints)
            });
        }
        const user = await User.findByPk(req.userId);

        const level = await user.getLevel();

        const users = await User.findAll({
            where: {
                LevelId: level.id
            }
        });

        let ranking = [];

        for (const user of users) {
            ranking.push({
                id: user.id,
                username: user.username,
                totalPoints: user.totalPoints,
                lastRanking: user.lastRanking,
                avatar: user.avatar ? user.avatar : level.profileImage
            })
        }

        return res.status(200).json({
            success: true,
            ranking: ranking.sort((a, b) => b.totalPoints - a.totalPoints)
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter o ranking do nível. Tente novamente!"
        });
    }
}

exports.updateLevel = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para atualizar níveis!",
        });
    }

    if (!req.body.points && !req.body.profileImage) {
        return res.status(400).json({
            success: false,
            msg: "É necessário pelo menos um elemento para atualizar o nível!"
        })
    }

    try {
        const level = await Level.findByPk(req.params.idLevel);

        if (!level) {
            return res.status(404).json({
                success: false,
                msg: "Nível não encontrada!"
            });
        }

        const data = cleanEmptyObjectKeys(trimObjectStrings(req.body));

        if (!Object.keys(data).length) {
            return res.status(400).json({
                success: false,
                msg: "Não tem informação para atualizar!"
            });
        }

        await Level.update(data, {
            where: {
                id: req.params.idLevel
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Nível atualizado!"
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
            msg: err.message || "Ocorreu um erro ao atualizar o nível. Tente novamente!"
        });
    }
}

exports.executeRankingUpdate = async (req, res) => {
    const allUsers = await User.findAll({
        where: { typeUser: "regular" }
    });

    let usersGroupByRanking = allUsers.map(user => user.dataValues).reduce((group, user) => {
        const level = user.LevelId;
        group[level] = group[level] ?? [];
        group[level].push(user);
        group[level].sort((a, b) => b.totalPoints - a.totalPoints);
        return group;
    }, {});

    for (const level in usersGroupByRanking) {
        for (let index = 0; index < usersGroupByRanking[level].length; index++) {
            const rank = usersGroupByRanking[level];
            let userToUpdate = rank[index];
            await User.update({ lastRanking: index + 1 }, { where: { id: userToUpdate.id } });
        }
    }
}