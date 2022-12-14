module.exports = (sequelize, DataTypes) => {
    const Level = sequelize.define("Levels", {
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            min: 10,
            validate: {
                isInt: {
                    msg: "O número de pontos precisa de ser inteiro!"
                },
                notNull: {
                    msg: "Número de pontos não pode estar vazio!"
                }
            }
        },
        profileImage: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Avatar não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Avatar não pode estar vazio!"
                }
            }
        }
    }, {
        timestamps: false
    });
    return Level;
};