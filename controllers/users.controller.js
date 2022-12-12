const jwt = require("jsonwebtoken"); //JWT tokens creation (sign())
const bcrypt = require("bcryptjs"); //password encryption
const config = require("../config/config.js");
const {
    Op
} = require("sequelize");
const db = require("../models");
const User = db.users;

exports.register = async (req, res) => {
    try {
        const newUser = {
            username: req.body.username.trim(),
            password: req.body.password.trim(),
            full_name: req.body.full_name.trim(),
            email: req.body.email.trim(),
        };

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

        const userCreated = await User.create({
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
};

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

        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({
            userId: user.id
        }, config.SECRET, {}); // token that doesn't expires
        return res.status(200).json({
            success: true,
            accessToken: token
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            msg: err.message || "Ocorreu um erro no login. Tente novamente!"
        });
    }
};