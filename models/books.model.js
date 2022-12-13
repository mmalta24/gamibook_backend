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
        img_book: {
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
        img_background: {
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
        CategoryId:{
            type: DataTypes.NUMBER,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Category id cannot be empty!"
                },
                notEmpty: {
                    msg: "Category id cannot be empty!"
                },
            }
        }
    }, {
        timestamps: false
    });
    return Book;
};