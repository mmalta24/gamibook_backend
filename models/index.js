const dbConfig = require('../config/db.config.js');
//export classes Sequelize and Datatypes
const {
    Sequelize,
    DataTypes
} = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});
// OPTIONAL: test the connection
(async () => {
    try {
        await sequelize.authenticate;
        console.log('Connection has been established successfully.');
    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
})();

const db = {}; //object to be exported
db.sequelize = sequelize; //save the Sequelize instance (actual connection pool)

//save the models defined within the API
db.users = require("./users.model.js")(sequelize, DataTypes);
db.levels = require("./levels.model.js")(sequelize, DataTypes);
db.categories = require("./categories.model.js")(sequelize, DataTypes);
db.books = require("./books.model.js")(sequelize, DataTypes);
db.book_modules = require("./book_modules.model.js")(sequelize, DataTypes);
db.activity = require("./activity.model.js")(sequelize, DataTypes);
db.activity_type = require("./activity_type.model.js")(sequelize, DataTypes);
db.achievements = require("./achievements.model.js")(sequelize, DataTypes);
db.notifications = require("./notifications.model.js")(sequelize, DataTypes);
db.user_books = require("./user_books.model.js")(sequelize, DataTypes)
db.user_history = require("./user_history.model.js")(sequelize, DataTypes)

//define the relationship N:M between Users and Books models
db.users.belongsToMany(db.books, {
    through: 'User_Books',
    timestamps: false
});
db.books.belongsToMany(db.users, {
    through: 'User_Books',
    timestamps: false
});

//define the relationship 1:N between Books and categories
db.categories.hasMany(db.books); // if category is deleted, delete all books associated with it
db.books.belongsTo(db.categories);

//define the relationship 1:N between Books and Books_Module
db.books.hasMany(db.book_modules, { onDelete: 'CASCADE' }); // if book is deleted, delete all modules associated with it
db.book_modules.belongsTo(db.books);

//define the relationship 1:N between Books_Module and Activity
db.book_modules.hasMany(db.activity); // if module is deleted, delete all activities associated with it
db.activity.belongsTo(db.book_modules);


//define the relationship 1:N between Activity_Type and Activity
db.activity_type.hasMany(db.activity); // if activity type is deleted, delete all activities associated with it
db.activity.belongsTo(db.activity_type);

//define the relationship N:M between Users and Activity models
db.users.belongsToMany(db.activity, {
    through: 'User_History',
    timestamps: false
});
db.activity.belongsToMany(db.users, {
    through: 'User_History',
    timestamps: false
});

//define the relationship N:M between Users and Books models
db.users.belongsToMany(db.books, {
    through: 'User_Books',
    timestamps: false
});
db.books.belongsToMany(db.users, {
    through: 'User_Books',
    timestamps: false
});

//define the relationship N:M between Users and Books models
db.users.belongsToMany(db.achievements, {
    through: 'User_Achievements',
    timestamps: false
});
db.achievements.belongsToMany(db.users, {
    through: 'User_Achievements',
    timestamps: false
});

//define the relationship 1:N between Levels and Users
db.levels.hasMany(db.users); // if level is deleted, delete all users associated with it
db.users.belongsTo(db.levels);

//define the relationship 1:N between Users and Notifications
db.users.hasMany(db.notifications); // if user is deleted, delete all notifications associated with it
db.notifications.belongsTo(db.users);

(async () => {
    try {
        await db.sequelize.sync();
        console.log('DB is successfully synchronized')
    } catch (error) {
        console.log(error)
    }
})();

module.exports = db;