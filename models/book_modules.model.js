module.exports = (sequelize, DataTypes) => {
    const Module = sequelize.define("Book_Modules", {
        module_name: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Nome não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome não pode estar vazio!"
                },
            }
        },

    }, {
        timestamps: false
    });
    return Module;
};