'use strict'

//cargar modules
var express = require('express');
var bodyParser = require('body-parser');

//ejecutar express
var app = express();

//cargar ficheros de las rutas http
var article_routes = require('./routes/article');

//middlewares
app.use(bodyParser.urlencoded({ extended: false }));
//convertir cualquier peticion que llege a json
app.use(bodyParser.json());

//cors

//cargar rutas
app.use('/api',article_routes);


// exportar modulo

module.exports = app;