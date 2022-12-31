require('dotenv').config(); // read environment variables from .env file
const express = require('express');
const cors = require('cors'); // middleware to enable CORS (Cross-Origin Resource Sharing)
const cron = require('node-cron');
const app = express();
const port = process.env.PORT; // use environment variables
const host = process.env.HOST;
app.use(cors()); //enable ALL CORS requests (client requests from other domain)
app.use(express.json()); //enable parsing JSON body data

/*
cron is a task scheduler that executes a function
cron expression: minute hour day(number) month day(weekday)
 */
// At 00:00 on day-of-month 1 in every 3rd month.
cron.schedule('0 0 1 */3 *', require('./controllers/levels.controller.js').executeRankingUpdate);

// Swagger
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

// routing middleware for resources
app.use('/users', require('./routes/users.routes.js'));
app.use('/achievements', require('./routes/achievements.routes'));
app.use('/levels', require('./routes/levels.routes'));
app.use('/categories', require('./routes/categories.routes'));
app.use('/activityTypes', require('./routes/activitytypes.routes'));
app.use('/books', require('./routes/books.routes'));
app.use('/myBooks', require('./routes/user_books.routes'));

// handle invalid routes
app.get('*', function (req, res) {
    res.status(404).json({
        message: 'WHAT???'
    });
});

app.listen(port, host, () => console.log(`App listening at http://${host}:${port}/`));