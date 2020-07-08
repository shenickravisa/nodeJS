//clase diferentes metodos y rutas relacionadas con la api
'use strict'

var validator = require('validator');
//eliminar archivos subidos
var fs = require('fs');
//acceder a la ruta del proyecto
var path = require('path')
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
    },
    update: (req, res) => {
        //recoger el id del articulo que viene por la url
        var articleId = req.params.id
        //recoger los datos que llegan por put
        var params = req.body
        //validar datos
        try {
            var validate_title = !validator.isEmpty(params.title) //cuando no venga vacio has true
            var validate_content = !validator.isEmpty(params.content)
        } catch (err) {
            return res.status(200).send({
                status: 'error',
                message: 'falta datos por enviar'
            })
        }
        if (validate_title && validate_content) {
            //este metodo busca por el id que le mandemos como parametro y lo actualiza, params son los parametros
            //enviados a actualizar y el new true regresa el objeto actualizado, por ultimo una funcion de callback si es error y el objeto actualizado
            Article.findOneAndUpdate({ _id: articleId },
                params, { new: true }, (err, articleUpdated) => {
                    if (err) {
                        return res.status(500).send({
                            status: 'error',
                            message: 'error al actualizar' // si existe un error
                        })
                    }
                    if (!articleUpdated) {
                        return res.status(404).send({
                            status: 'error',
                            message: 'no existe el articulo' // si no existe un articulo actualizado
                        })
                    }
                    return res.status(200).send({
                        status: 'success',
                        article: articleUpdated
                    })
                })
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validacion no es correcta'
            })
        }
    },
    delete: (req, res) => {
        //recoger el id de la url
        var articleId = req.params.id
        //find and delete  findOneAndDelete metodo que con base a un id busca y elimina el objeto
        Article.findOneAndDelete({ _id: articleId }, (err, articleRemoved) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'error al eliminar'
                })
            }
            if (!articleRemoved) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se ha borrado el articulo'
                })
            }
            return res.status(200).send({
                status: 'success',
                article: articleRemoved
            })
        })
    },
    upload: (req, res) => {
        //configurar el modulo connect multipart router/article.js
        //reocger el fichero de la peticion 
        var file_name = 'Imagen no subida'
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            })
        }
        console.log(req.files)
        //conseguir el nombre y la extension del archivo
        var file_path = req.files.file0.path;
        var file_split = file_path.split('/')
        // en windows es con diagonal invertida
        //nombre del archivo
        var file_name = file_split[2]
        //extension del archivo
        var extension_split = file_name.split('\.')
        var file_ext = extension_split[1]
        //comprobar la extension, solo imagenes y si no eliminar el fichero
        if (file_ext !== 'png' && file_ext !== 'jpg' && file_ext !== 'jpeg' && file_ext !== 'gif') {
            //borrar el archivo subido buscado por path
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: 'error',
                    message: 'la extension de la imagen no es valida'
                });
            })
        } else {
            //si todo es valido
            var articleId = req.params.id
            //buscar el articulo asignarle el nombre de la imagen y actualizarlo 
            Article.findOneAndUpdate({ _id: articleId }, { image: file_name }, { new: true }, (err, articleUpdated) => {
                //image: file_name se le adjuntara como nuevo objeto dentro de la respuesta de articleUpdated
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: 'error',
                        message: 'error al guardar la imagen del articulo'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    article: articleUpdated
                });
            })
        }
    },
    getImage: (req, res) => {
        var file = req.params.image
        var path_file = './upload/articles/' + file
        //buscamos la ruta de la imagen dentro de los archivos que se han subido y validamos si existe ese archivo
        fs.exists(path_file, (exists) => {
            if (exists) {
                return res.sendFile(path.resolve(path_file)) // este metodo es propio de express y regresa un archivo solo le mandamos el nombre de la ruta 
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'la imagen no existe'

                });
            }
        })
    },
    search: (req, res) => {
        //sacar el string a buscar
        var searchString = req.params.search

        //find or
        Article.find({
            '$or': [{ 'title': { '$regex': searchString, '$options': 'i' } },
            { 'content': { '$regex': searchString, '$options': 'i' } }
            ]
            //expresion regular de mongo $or que si searchString esta incluido en titulo o contenido obtener todo el objeto
        }).sort([['date', 'descending']]).exec((err, articles) => { // sort ordena y exec ejecuta la query es de mongoDB
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'elemento no encontrado'
                });
            }
            return res.status(200).send({
                status: 'success',
                articles
            });
        })
    }

};

module.exports = controller;