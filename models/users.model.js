module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("Users", {
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Nome não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Username não pode estar vazio!"
                },
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
                    msg: "Username não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Username não pode estar vazio!"
                },
                isAlphanumeric: {
                    msg: "O username só pode conter letras e números!"
                },
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
                },
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "Password não pode estar vazia!"
                },
            }
        },
        did_onboarding: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        tickets: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                isInt: {
                    msg: "O número de pontos precisa de ser inteiro!"
                },
            }
        },
        total_points: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        last_ranking: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {
                isInt: {
                    msg: "O ranking anterior precisa de ser inteiro!"
                }
            }
        },
        type_user: {
            type: DataTypes.ENUM("normal", "admin"),
            allowNull: false,
            defaultValue: "normal",
            validate: {
                isIn: {
                    args: [
                        ["normal", "admin"]
                    ],
                    msg: "O utilizador só pode ser normal ou administrador!"
                }
            }
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }, {
        timestamps: false
    });
    return User;
};