module.exports = (sequelize, DataTypes) => {
    const Achievement = sequelize.define("Achievements", {
        name: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        points_needed: {
            type: DataTypes.STRING,
        },
        img:{
            type:DataTypes.STRING
        }
    }, { timestamps: false });
    return Achievement;
};