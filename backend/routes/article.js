//aqui se iran creando todas la rutas http creadas en los modelos de la aplicacion backend que se tendran que exportar en el app.js 
'use strict'
var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

//rutas de prueba
router.get('/test-de-controlador', ArticleController.test);
router.post('/datos-curso', ArticleController.datosCurso);

//rutas para articulos

//rutas utiles
router.post('/save', ArticleController.save);
//router.get('/articles', ArticleController.getArticles); trae todo
router.get('/articles/:last?', ArticleController.getArticles); //parametros opcionales ?
router.get('/article/:id', ArticleController.getArticle); //parametros opcionales


module.exports = router;