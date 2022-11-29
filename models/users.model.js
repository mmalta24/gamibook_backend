module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("Users", {
        full_name: {
            type: DataTypes.STRING,
        },
        username: {
            type: DataTypes.STRING,
        },
        email: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        did_onboarding: {
            type: DataTypes.BOOLEAN
        },
        tickets: {
            type: DataTypes.INTEGER,
            default: 0
        },
        total_points: {
            type: DataTypes.INTEGER,
            default: 0
        },
        last_ranking: {
            type: DataTypes.INTEGER
        },
        type_User: {
            type: DataTypes.STRING
        },
        avatar: {
            type: DataTypes.STRING,
            default: 'avatar'
        }
    }, { timestamps: false });
    return User;
};