module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Categories", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            unique: {
                args: true,
                msg: "Category name already exists!"
            },
            validate: {
                notNull: {
                    msg: "Category name cannot be empty!"
                },
                notEmpty: {
                    msg: "Category name cannot be empty!"
                },
            }
        },
    }, {
        timestamps: false
    });
    return Category;
};