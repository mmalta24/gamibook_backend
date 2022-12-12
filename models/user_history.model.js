const db = require("../models/index.js");
const Users = db.users;
const Activity = db.activity;

module.exports = (sequelize, DataTypes) => {
    const User_History = sequelize.define("User_History", {
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: Users,
                key: "id"
            }
        },
        ActivityId: {
            type: DataTypes.INTEGER,
            references: {
                model: Activity,
                key: "id"
            }
        },
        answers: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Resposta não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Resposta não pode estar vazia!"
                },
            }
        }
    }, {
        timestamps: false
    });
    return User_History;
};