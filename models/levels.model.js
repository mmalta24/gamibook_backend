module.exports = (sequelize, DataTypes) => {
    const Level = sequelize.define("Levels", {
        level_nr: {
            type: DataTypes.INTEGER,
            allowNull: false,
            notEmpty: true,
            unique: {
                args: true,
                msg: "Número do nível já existe!"
            },
            validate: {
                notNull: {
                    msg: "Número do nível não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Número do nível não pode estar vazio!"
                },
            }
        },
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Número de pontos não pode estar vazio!"
                },
            }
        },
        profile_image: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Avatar não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Avatar não pode estar vazio!"
                },
            }
        }
    }, {
        timestamps: false
    });
    return Level;
};