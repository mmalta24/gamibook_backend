module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define("Notification", {
        title: {
            type: DataTypes.STRING,
        },
        body: {
            type: DataTypes.STRING,
        }
    }, { timestamps: false });
    return Notification;
};