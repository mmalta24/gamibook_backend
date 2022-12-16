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
                    msg: "Nome não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome não pode estar vazio!"
                },
            }
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Descrição não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Descrição não pode estar vazia!"
                },
            }
        },
        pointsNeeded: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: {
                    msg: "O número de pontos precisa de ser inteiro!"
                },
            }
        },
        img: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Imagem não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Imagem não pode estar vazia!"
                },
            }
        }
    }, {
        timestamps: false
    });
    return Achievement;
};