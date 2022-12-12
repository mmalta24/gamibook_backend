module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notifications", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Título da notificação não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Título da notificação não pode estar vazio!"
                },
            }
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Texto da notificação não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Texto da notificação não pode estar vazio!"
                },
            }
        }
    }, {
        timestamps: false
    });
    return Notification;
};