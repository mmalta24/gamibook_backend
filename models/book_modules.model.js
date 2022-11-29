module.exports = (sequelize, DataTypes) => {
    const Module = sequelize.define("Book-Modules", {
        module_name: {
            type: DataTypes.STRING,
        },
        
    }, { timestamps: false });
    return Module;
};