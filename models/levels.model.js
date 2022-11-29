module.exports = (sequelize, DataTypes) => {
    const Level = sequelize.define("Levels", {
        level_nr: {
            type: DataTypes.INTEGER,
        },
        points: {
            type: DataTypes.INTEGER,
        },
        profile_image: {
            type: DataTypes.STRING,
        }
    }, { timestamps: false });
    return Level;
};