module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("Users", {
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Nome não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome não pode estar vazio!"
                }
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            unique: {
                args: true,
                msg: "Nome de utilizador já existe!"
            },
            validate: {
                notNull: {
                    msg: "Nome de utilizador não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome de utilizador não pode estar vazio!"
                }
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            unique: {
                args: true,
                msg: "Email já existe!"
            },
            validate: {
                notNull: {
                    msg: "Email não pode estar vazio!"
                },
                isEmail: {
                    msg: "Precisa de seguir o formato de email!"
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Password não pode estar vazia!"
                }
            }
        },
        tickets: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            min: 0,
            validate: {
                isInt: {
                    msg: "O número de pontos precisa de ser inteiro!"
                }
            }
        },
        totalPoints: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            min: 0,
            validate: {
                isInt: {
                    msg: "O número de pontos precisa de ser inteiro!"
                }
            }
        },
        lastRanking: {
            type: DataTypes.INTEGER,
            allowNull: true,
            min: 1,
            validate: {
                isInt: {
                    msg: "O ranking anterior precisa de ser inteiro!"
                }
            }
        },
        typeUser: {
            type: DataTypes.ENUM("regular", "admin"),
            allowNull: false,
            defaultValue: "regular",
            validate: {
                isIn: {
                    args: [
                        ["regular", "admin"]
                    ],
                    msg: "O utilizador só pode ser regular ou administrador!"
                }
            }
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        lastTimeLogged: {
            type: DataTypes.STRING,
        }
    }, {
        timestamps: false
    });
    return User;
};