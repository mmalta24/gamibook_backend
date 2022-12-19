const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../config/config.js");
const {
    generateDate,
    trimObjectStrings
} = require("../utilities/index.js");
const {
    Op,
    ValidationError
} = require("sequelize");
const db = require("../models");
const User = db.users;
const Notification = db.notifications;

exports.register = async (req, res) => {
    try {
        const newUser = trimObjectStrings({
            ...req.body,
            LevelId: 1
        });

        const user = await User.findOne({
            where: {
                [Op.or]: [{
                    username: newUser.username
                }, {
                    email: newUser.email
                }]
            }
        });

        if (user) {
            return res.status(406).json({
                success: false,
                msg: "Já existe um utilizador com esse username ou email!"
            });
        }

        await User.create({
            ...newUser,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return res.status(201).json({
            success: true,
            msg: "Utilizador criado!",
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
            msg: err.message || "Ocorreu um erro no registo. Tente novamente!"
        });
    }
}

exports.login = async (req, res) => {
    try {
        let user = await User.findOne({
            where: {
                username: req.body.username
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                msg: "Credenciais erradas!"
            });
        }

        // tests a string (password in body) against a hash (password in database)
        const check = bcrypt.compareSync(req.body.password, user.password);

        if (!check) {
            return res.status(401).json({
                success: false,
                msg: "Credenciais erradas!"
            });
        }

        await User.update({
            lastTimeLogged: generateDate()
        }, {
            where: {
                id: user.id
            }
        });

        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        // token that doesn't expires
        const token = jwt.sign({
            userId: user.id,
            typeUser: user.typeUser
        }, config.SECRET, {});

        return res.status(200).json({
            success: true,
            accessToken: token,
            typeUser: user.typeUser
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro no login. Tente novamente!"
        });
    }
}

exports.getProfile = async (req, res) => {
    try {
        let user = await User.findByPk(req.userId, {
            attributes: {
                exclude: ['password']
            }
        });

        const level = await user.getLevel();

        // update log when user opens app
        await User.update({
            lastTimeLogged: generateDate()
        }, {
            where: {
                id: req.userId
            }
        });

        let userObj = {};

        for (const key in user.dataValues) {
            userObj[key] = key === "avatar" ? (user.avatar ? user.avatar : level.profileImage) : user[key];
        }

        return res.status(200).json({
            success: true,
            user: userObj
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter a informação do perfil. Tente novamente!"
        });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        if (req.body.password) {
            await User.update({
                password: bcrypt.hashSync(req.body.password, 10)
            }, {
                where: {
                    id: req.userId
                }
            });
        } else {
            await User.update({
                avatar: req.body.avatar
            }, {
                where: {
                    id: req.userId
                }
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Campo atualizado!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao atualizar a informação. Tente novamente!"
        });
    }
}

exports.findProfileNotifications = async (req, res) => {
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver notificações!",
        });
    }

    try {
        const notifications = await Notification.findAll({
            where: {
                UserId: req.userId
            }
        })

        return res.status(200).json({
            success: true,
            notifications: notifications
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter as notificações. Tente novamente!"
        });
    }
}

exports.deleteProfileNotification = async (req, res) => {
    if (req.typeUser === "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para apagar notificações!",
        });
    }

    try {
        const notification = await Notification.findOne({
            where: {
                UserId: req.userId,
                id: req.params.notificationId
            }
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                msg: "Notificação não encontrada!"
            });
        }

        await Notification.destroy({
            where: {
                UserId: req.userId,
                id: req.params.notificationId
            }
        });

        return res.status(200).json({
            success: true,
            msg: "Notificação apagada!"
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao apagar a notificação. Tente novamente!"
        });
    }
}

exports.findAllUsers = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver todos os utilizadores!",
        });
    }

    try {
        const allUsers = await User.findAll({
            attributes: {
                exclude: ['password']
            }
        });

        let users = [];

        for (const user of allUsers) {
            const level = await user.getLevel();
            const u = {};
            for (const key in user.dataValues) {
                u[key] = key === "avatar" ? (user.avatar ? user.avatar : level.profileImage) : user[key];
            }
            users.push(u);
        }

        return res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter todos os utilizadores. Tente novamente!"
        });
    }
}

exports.createAdminUser = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para criar utilizadores do tipo administrador!",
        });
    }

    try {
        const newUser = trimObjectStrings({
            ...req.body,
            typeUser: "admin",
            avatar: "https://vinhhungjsc.com/public/admin/img/avatar.png"
        });

        const user = await User.findOne({
            where: {
                [Op.or]: [{
                    username: newUser.username
                }, {
                    email: newUser.email
                }]
            }
        });

        if (user) {
            return res.status(406).json({
                success: false,
                msg: "Já existe um utilizador com esse username ou email!"
            });
        }

        await User.create({
            ...newUser,
            password: bcrypt.hashSync(req.body.password, 10)
        });

        return res.status(201).json({
            success: true,
            msg: "Administrador criado!"
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
            msg: err.message || "Ocorreu um erro ao criar o utilizador. Tente novamente!"
        });
    }
}

exports.findOneUser = async (req, res) => {
    if (req.typeUser !== "admin") {
        return res.status(403).json({
            success: false,
            msg: "O seu tipo de utilizador não tem permissões para ver utilizadores específicos!",
        });
    }

    try {
        let user = await User.findByPk(req.params.idUser, {
            attributes: {
                exclude: ['password']
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Utilizador não encontrado!"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro ao obter esse utilizador. Tente novamente!"
        });
    }
}