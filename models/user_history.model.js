const db = require("../models/index.js");
const Users = db.users;
const Activity = db.activity;

module.exports = (sequelize, DataTypes) => {
    const UserHistory = sequelize.define("User_History", {
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
    return UserHistory;
};