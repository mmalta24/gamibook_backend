module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define("Books", {
        name: {
            type: DataTypes.STRING,
        },
        image: {
            type: DataTypes.STRING,
        },
        img_case:{
            type:DataTypes.STRING
        }
    }, { timestamps: false });
    return Book;
};