module.exports = (sequelize, DataTypes) => {
    const Achievement = sequelize.define("Achievements", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            unique: {
                args: true,
                msg: "Nome da conquista já existe!"
            },
            validate: {
                notNull: {
                    msg: "Nome da conquista não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome da conquista não pode estar vazio!"
                }
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Descrição da conquista não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Descrição da conquista não pode estar vazia!"
                }
            }
        },
        pointsNeeded: {
            type: DataTypes.INTEGER,
            allowNull: false,
            min: 0,
            validate: {
                isInt: {
                    msg: "O número de pontos da conquista precisa de ser inteiro!"
                }
            }
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Imagem da conquista não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Imagem da conquista não pode estar vazia!"
                }
            }
        }
    }, {
        timestamps: false
    });
    return Achievement;
};