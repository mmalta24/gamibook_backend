const db = require("../models/index.js");
const Users = db.users;
const Activity=db.activity;

module.exports = (sequelize, DataTypes) => {
    const User_History = sequelize.define("User_History", {
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: Users, key: 'id'
            }
        },
        ActivityId: {
            type: DataTypes.INTEGER,
            references: {
                model: Activity, key: 'id'
            }
        },
        answers:{
            type:DataTypes.STRING
        }
    }, { timestamps: false });
    return User_History;
};