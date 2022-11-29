module.exports = (sequelize, DataTypes) => {
    const Activity = sequelize.define("Activities", {
        name: {
            type: DataTypes.STRING,
        },
        question: {
            type: DataTypes.STRING,
        },
        options: {
            type: DataTypes.STRING,
        },
        correct_answer: {
            type: DataTypes.STRING,
        },
        points: {
            type: DataTypes.INTEGER
        },
        img_case:{
            type:DataTypes.STRING
        }
    }, { timestamps: false });
    return Activity;
};