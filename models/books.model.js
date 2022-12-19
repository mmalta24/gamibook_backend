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
                msg: "Nome do livro já existe!"
            },
            validate: {
                notNull: {
                    msg: "Nome do livro não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome do livro não pode estar vazio!"
                }
            }
        },
        imgBook: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Capa do livro não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Capa do livro não pode estar vazia!"
                }
            }
        },
        imgBackground: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Imagem de fundo não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Imagem de fundo não pode estar vazio!"
                }
            }
        },
        code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: {
                args: true,
                msg: "Código de livro já existe!"
            },
            validate: {
                isInt: {
                    msg: "O código de livro precisa de ser inteiro!"
                }
            }
        },
    }, {
        timestamps: false
    });
    return Book;
};