module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define("Activities", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Nome da atividade não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome da atividade não pode estar vazio!"
                }
            }
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Enunciado da atividade não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Enunciado da atividade não pode estar vazio!"
                }
            }
        },
        example: {
            type: DataTypes.STRING,
        },
        question: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Questão não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Questão não pode estar vazia!"
                }
            }
        },
        options: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Opções não pode estar vazias!"
                },
                notEmpty: {
                    msg: "Opções não pode estar vazias!"
                }
            }
        },
        correctAnswer: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Resposta correta não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Resposta correta não pode estar vazia!"
                }
            }
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "O número de pontos precisa de ser inteiro!"
                }
            }
        },
        imgBackground: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            defaultValue: "https://img.freepik.com/premium-photo/front-view-pile-books-with-copy-space_23-2148255858.jpg?w=2000",
            validate: {
                notNull: {
                    msg: "Imagem de fundo não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Imagem de fundo não pode estar vazia!"
                }
            }
        }
    }, {
        timestamps: false
    });
    return Activity;
};