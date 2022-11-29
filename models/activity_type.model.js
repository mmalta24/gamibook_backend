module.exports = (sequelize, DataTypes) => {
    const Activity_Type = sequelize.define("Activity_Types", {
        name: {
            type: DataTypes.STRING,
        }
    }, { timestamps: false });
    return Activity_Type;
};