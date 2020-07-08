//aqui se iran creando todas la rutas http creadas en los modelos de la aplicacion backend que se tendran que exportar en el app.js 
'use strict'
var express = require('express');
var ArticleController = require('../controllers/article');

var router = express.Router();

//cargar el modulo de multipart
var multipart = require('connect-multiparty');
//se ejecuta antes del controlador se dispone de la ruta donde se guardaran
var md_upload = multipart({ uploadDir: './upload/articles' })

//rutas de prueba
router.get('/test-de-controlador', ArticleController.test);
router.post('/datos-curso', ArticleController.datosCurso);

//rutas para articulos

//rutas utiles
router.post('/save', ArticleController.save);
//router.get('/articles', ArticleController.getArticles); trae todo
router.get('/articles/:last?', ArticleController.getArticles); //parametros opcionales ?
router.get('/article/:id', ArticleController.getArticle); //parametros opcionales
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.upload); //se aplica un middleware antes de que se ejecute el controlador
router.get('/get-image/:image', ArticleController.getImage)
router.get('/search/:search', ArticleController.search) //ruta para hacer un buscador


module.exports = router;