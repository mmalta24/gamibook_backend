const db = require("./index.js");
const Category = db.categories;

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("Books", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            unique: {
                args: true,
                msg: "Book name already exists!"
            },
            validate: {
                notNull: {
                    msg: "Book name cannot be empty!"
                },
                notEmpty: {
                    msg: "Book name cannot be empty!"
                },
            }
        },
        imgBook: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Book cover cannot be empty!"
                },
                notEmpty: {
                    msg: "Book cover cannot be empty!"
                },
            }
        },
        imgBackground: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Background image cannot be empty!"
                },
                notEmpty: {
                    msg: "Background image cannot be empty!"
                },
            }
        },
    }, {
        timestamps: false
    });
    return Book;
};