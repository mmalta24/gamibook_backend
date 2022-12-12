const db = require("../models/index.js");
const Users = db.users;
const Books = db.books;

module.exports = (sequelize, DataTypes) => {
    const User_Books = sequelize.define("User_Books", {
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: Users,
                key: "id"
            }
        },
        BookId: {
            type: DataTypes.INTEGER,
            references: {
                model: Books,
                key: "id"
            }
        },
        liked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false
    });
    return User_Books;
};