module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define("Categories", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            unique: {
                args: true,
                msg: "Nome da categoria já existe!"
            },
            validate: {
                notNull: {
                    msg: "Nome da categoria não pode estar vazia!"
                },
                notEmpty: {
                    msg: "Nome da categoria não pode estar vazia!"
                },
            }
        },
    }, {
        timestamps: false
    });
    return Category;
};