const db = require("./index.js");
const Users = db.users;
const Books = db.books;

module.exports = (sequelize, DataTypes) => {
    const UserBooks = sequelize.define("User_Books", {
        liked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        timestamps: false
    });
    return UserBooks;
};