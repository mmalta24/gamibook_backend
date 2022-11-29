module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Categories", {
        name: {
            type: DataTypes.STRING,
        },
    }, { timestamps: false });
    return Category;
};