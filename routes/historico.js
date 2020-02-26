const express = require('express')
const router = express.Router();
const Historico = require('../models/historico')


router.get('/:localizacion', async (req, res) => {
    console.log("consolta BD: " + JSON.stringify(req.body))
    // realizamos una query sobre la base de datos con los filtros
    // que hemos recibido del formulario.
    Historico.find(
        { // aqui indicamos el filtrado de los datos.
            "properties.localizacion": "SW VILAFLOR DE CHASNA.ITF"
        }, function (error, datos) {
            console.log("datos: " + JSON.stringify(datos))

            // una vez obtenidos los datos de la query, los enviamos de vuelta.
            res.send(datos)


        });
})

router.get('/queries/terremotoslocalizacion', async (req, res) => {
    console.log("consolta BD: " + JSON.stringify(req.body))
    // realizamos una query sobre la base de datos con los filtros
    // que hemos recibido del formulario.
    result = await Historico.aggregate([ { $group : { _id : "$properties.localizacion", count: { $sum: 1 } } } ]);
    console.log(result);
    res.send(result);
})

/*
//terremotos gordos
db.terremotos.aggregate([ { $match : { "properties.magnitud" : 4.0 } } , {$count: "terremotos_gordos"}] );
*/
router.get('/queries/grandesTerremotos', async (req, res) => {
    console.log("consolta BD: " + JSON.stringify(req.body))
    // realizamos una query sobre la base de datos con los filtros
    // que hemos recibido del formulario.
    result = await Historico.aggregate().match({ "properties.magnitud": { $gt: 4.0 }});
    console.log(result);
    res.send(result);
})

/*
//terremotos agrupados por tipo de magnitud
db.terremotos.aggregate([ {"$group" : {_id:"$properties.tipoMagnitud", count:{$sum:1}}} ])
*/
router.get('/queries/tiposTerremotos', async (req, res) => {
    console.log("consolta BD: " + JSON.stringify(req.body))
    // realizamos una query sobre la base de datos con los filtros
    // que hemos recibido del formulario.
    result = await Historico.aggregate([ { $group : { _id : "$properties.tipoMagnitud", count: { $sum: 1 } } } ]);
    console.log(result);
    res.send(result);
})


/*
//cantidades de terremotos de cada magnitud (magnitud mayor que 4)
db.terremotos.aggregate([ {"$group" : {_id:"$properties.magnitud", count:{$sum:1}}} ])
*/
router.get('/queries/magnitudesTerremotos', async (req, res) => {
    console.log("consolta BD: " + JSON.stringify(req.body))
    // realizamos una query sobre la base de datos con los filtros
    // que hemos recibido del formulario.
    result = await Historico.aggregate([ { $group : { _id : "$properties.magnitud", count: { $sum: 1 } } } ]);
    console.log(result);
    res.send(result);
})



module.exports = router;