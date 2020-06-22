'use strict'

//creamos una instancia de mongoose para utilizar sus propiedades
var mongoose = require('mongoose');
//desactivar la forma antigua y hacer que se activen los mas actuales
var app = require('./app');
var port = 3900;
mongoose.set('useFindAndModify', false);
//de esta forma si guardo se reinicia mongoose
mongoose.Promise = global.Promise;
/*
recibe la url de la conexion de nuestra BD
//useNewUrlParser: true utiliza la nueva sintaxis de mongoose
useUnifiedTopology: true resuelve problemas con mongoose en node
*/
let mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}

mongoose.connect('mongodb://localhost:27017/api_rest_blog', mongooseOptions).then(() => {
    console.log('conexion a la base de datos correcta');
    //crear servidor escuchar peticiones http
    app.listen(port, () => {
        console.log('Servidor corriendo en http://localhost:' + port);
    });
})

