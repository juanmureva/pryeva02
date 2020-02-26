// declaramos los modulos que vamos a utilizar en nuestra aplicación.
var express = require("express");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var request = require('request');

// inicializamos el modulo Express.
var app = express();
// inicializamos el modulo Router de Express.
var router = express.Router();
var path = __dirname + '/views/';
const urlLocal = 'mongodb://localhost:27017/infoSismica'
const colSismicas = 'geoTerremotos'
const colLocalizaciones = 'localizaciones'

mongoose.connect(urlLocal,
    { useNewUrlParser: true, useUnifiedTopology: true });
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'Error de Conexión: '));
conn.once('open', function (callback) {
    console.log('Conectado correctamente a la base de datos.');
});

// creamos el esquema (sin validación) de los documentos a guardar/obtener en la base de datos.
var aqiBDSchema = new mongoose.Schema({}, { strict: false });
//                         'nombre de la conexion en la BD'
var aqiBD = mongoose.model(colSismicas, aqiBDSchema);

//importando rutas
const localizacionRoutes = require('./routes/localizaciones')
const historicoRoutes = require('./routes/historico')


// declaramos las rutas a los diferentes recursos de nuestra aplicación.
router.use(function (req, res, next) {
    console.log("/pryEva02" + req.method + " " + req.url);
    next();
});

router.get("/", function (req, res) {
    res.sendFile(path + "index.html");
});

router.get("/LocalizacionesPage", function (req, res) {
    res.sendFile(path + "localizaciones.html");
});


router.get("/editlocation", function (req, res) {
    res.sendFile(path + "editLocation.html");
});

router.post("/live/save", function (req, res) {

    var estacion = req.body.estacion;
    var token = "2925a12d6716caa9e5eff975b281dd6eb985552c";

    // ejemplo:http://api.waqi.info/feed/@9495/?token=2925a12d6716caa9e5eff975b281dd6eb985552c
    var url = "http://api.waqi.info/feed/@" + estacion + "/?token=" + token + "";

    // realizamos una solicitud a la API con los datos anteriores.
    request({
        url: url,
        json: true
    }, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            var guardadatos = new aqiBD(body);
            guardadatos.save();
            console.log('');
            console.log('Datos salvados correctamente.');
            console.log('');
            res.send(body);
        }
    });
});

router.get("/history2", function (req, res) {
    res.sendFile(path + "history2.html");
});

router.get("/history", function (req, res) {
    res.sendFile(path + "history.html");
});

router.post("/history/find", function (req, res) {

    // obtenemos los valores del formulario recibido.
    var estacion = parseInt(req.body.estacion);
    var contaminante = req.body.contaminante;
    var fechaInicial = req.body.fechaInicial;
    var fechaFinal = req.body.fechaFinal;
    console.log("body: " + JSON.stringify(req.body))
    // realizamos una query sobre la base de datos con los filtros
    // que hemos recibido del formulario.
    aqiBD.find(
        { // aqui indicamos el filtrado de los datos.
            "data.idx": estacion,
            $and: [{
                "data.time.s": {
                    $gte: fechaInicial
                }
            }, {
                "data.time.s": {
                    $lte: fechaFinal
                }
            }]
        }, { // aqui indicamos la proyección de los datos.
        [contaminante]: 1,
        "data.time.s": 1,
        "_id": 0
    }, function (error, datos) {
        console.log("datos: " + JSON.stringify(datos))

        // una vez obtenidos los datos de la query, los enviamos de vuelta.
        res.send(datos)

    });
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/pryEva02/public", express.static(__dirname + "/public"));

//rutas
app.use('/pryEva02/localizaciones', localizacionRoutes)
app.use('/pryEva02/historico', historicoRoutes)
app.use("/pryEva02", router);


app.use(function (req, res, next) {
    res.status(404).send("Error: no se encuentra la pagina solicitada.")
})

app.listen(3000, function () {
    console.log("Servidor activo en puerto 3000");
});



