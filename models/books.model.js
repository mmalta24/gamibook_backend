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
                },
            }
        },
        img_book: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Capa do livro não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Capa do livro não pode estar vazia!"
                },
            }
        },
        img_background: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Imagem de fundo não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Imagem de fundo não pode estar vazio!"
                },
            }
        }
    }, {
        timestamps: false
    });
    return Book;
};