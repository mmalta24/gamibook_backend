module.exports = (sequelize, DataTypes) => {
    const Module = sequelize.define("Book_Modules", {
        moduleName: {
            type: DataTypes.STRING,
            allowNull: false,
            notEmpty: true,
            validate: {
                notNull: {
                    msg: "Nome do módulo não pode estar vazio!"
                },
                notEmpty: {
                    msg: "Nome do módulo não pode estar vazio!"
                }
            }
        },

    }, {
        timestamps: false
    });
    return Module;
};