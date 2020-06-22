//clase diferentes metodos y rutas relacionadas con la api
'use strict'

var validator = require('validator');
//importar el modelo con el que se crea el objeto e interactuan con la BD
var Article = require('../models/article');

var controller = {
    //añadir rutas por defecto es un get 
    //siempre reciben dos parametros el request y el response y retorna un valor 
    datosCurso: (req, res) => {
        //recibir datos de un post
        var hola = req.body.hola;
        return res.status(200).send({
            curso: 'Master en frameworks js',
            autor: 'shenick guzman',
            hola
        });

    },
    test: (req, res) => {
        return res.status(200).send({
            message: 'soy la accion test de mi controlador de articulos'
        });
    },
    //guardar articulos
    save: (req, res) => {
        //recoger parametros por post
        var params = req.body;
        //validar datos (validator)
        try {
            //creamos un validador por cada atributo del modelo creado para conectar a la base de datos y simplemente indica que es verdadero 
            //cuando no venga vacio
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
        } catch (e) {
            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar' + e
            });
        }
        if (validate_title && validate_content) {
            //crear el objeto a guardar se igual al objeto creado en models
            var article = new Article();
            //asignar valores
            article.title = params.title;
            article.content = params.content;
            article.image = null;
            //guardar el articulo
            article.save((err, articleStored) => {
                if (err || !articleStored) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El articulo no se ha guardado'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleStored
                });
            });
            //devolver una respuesta
            // return res.status(200).send({
            //     status: 'success',
            //     article
            // });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'los datos no son validos'
            });
        }
    },
    //obtner articulos
    getArticles: (req, res) => {
        var last = req.params.last;
        var query = Article.find({})
        // regresa un limite si se se le manda un parametro
        if (last || last !== undefined) {
            query.limit(5);
        }
        //find puede ser por un campo en especial pero en este caso se devolveran todos
        //.sort('-id') significa que regresa los datos de manera descendente sin el -_ es ascedente
        query.sort('-_id').exec((err, articles) => {
            //errores
            if (err) {
                return res.status(200).send({
                    status: 'error',
                    message: 'error al devolver los articulos'
                });
            }
            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos'
                });
            }

            return res.status(200).send({
                status: 'success',
                articles
            });

        });
    },
    getArticle: (req, res) => {
        //recoger el id de la url
        var articleId = req.params.id;
        //comprobar que existe 
        if (!articleId || articleId === null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo'
            });
        }
        //buscar el articulo por un id
        Article.findById(articleId, (err, article) => {
            if (!article || err) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo'
                });
            }
            // devolverlo en json
            return res.status(200).send({
                status: 'success',
                article
            });
        });
    }

};

module.exports = controller;