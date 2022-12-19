const db = require("../models/index.js");
const Users = db.users;
const Activity = db.activity;

module.exports = (sequelize, DataTypes) => {
    const UserHistory = sequelize.define("User_History", {
        answers: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });
    return UserHistory;
};