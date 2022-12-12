module.exports = (sequelize, DataTypes) => {
    const Activity_Type = sequelize.define("Activity_Type", {
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
        }
    }, {
        timestamps: false
    });
    return Activity_Type;
};