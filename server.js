const dotenv = require('dotenv');
dotenv.config();
var express = require('express'),
    app = express(),
    port = process.env.PORT,
    bodyParser = require('body-parser');
// controller = require('./app/controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./app/routes');
routes(app);

app.listen(port);
console.log('RESTful API server started on: ' + port);