module.exports = (sequelize, DataTypes) => {
    const Activity_Type = sequelize.define("ActivityTypes", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            unique: {
                args: true,
                msg: "Nome do tipo de atividade já existe!"
            },
            validate: {
                notNull: {
                    msg: "Nome do tipo de atividade não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome do tipo de atividade não pode estar vazio!"
                }
            }
        }
    }, {
        timestamps: false
    });
    return Activity_Type;
};