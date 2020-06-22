//los modelos son la estructura de los esquemas que interactuan con la BD
'use strict'

var mongoose = require('mongoose');
// utilizar el objeto de este tipo
var Schema = mongoose.Schema;
//definir la estructura cada uno de los objetos de este tipo
var ArticleSchema = Schema({
    title: String,
    content: String,
    date: {type: Date, default: Date.now},
    image: String
});

//por cada coleccion de datos hay que definir un modelo
module.exports = mongoose.model('Article',ArticleSchema);
//mongoose crea ese nombre en plural y guarda documentos de este tipo y con estructura dentro de la coleccion
