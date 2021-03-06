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
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


//cargar rutas
app.use('/api',article_routes);


// exportar modulo

module.exports = app;