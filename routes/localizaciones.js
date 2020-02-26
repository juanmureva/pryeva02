const express = require('express')
const router = express.Router();
const Localizaciones = require('../models/localizaciones')


router.get('/:localizacion', async (req, res) => {
    let localizacion = req.params.localizacion;
    console.log("buscando: " + JSON.stringify(localizacion))
    let localizaciones = await Localizaciones.find({ "localizacion": localizacion })
    if (localizaciones === undefined || localizaciones == null || localizaciones.length == 0) {
        keyword = keyword.toUpperCase();
        localizaciones = await Localizaciones.find({ "localizacion": localizacion })

    }
    console.log("localizaciones encontradas: " + localizaciones);
    result = { status: "ok", data: localizaciones }
    res.send(
        result
    )
})

router.post("/", function (req, res) {
    console.log("petición recibida: " + JSON.stringify(req.body));
    var guardadatos = new Localizaciones(req.body);
    guardadatos.save();
    res.send();
});

router.put("/:idlocalizacion", async (req, res) => {
    let loci = req.body;
    console.log("petición recibida: " + JSON.stringify(req.body));

    Localizaciones.findById(loci._id, function (err, doc) {
        if (err)
            console.log("ha ocurrido un error: " + JSON.stringify(err));
        doc.localizacion = loci.localizacion;
        doc.latitud = loci.latitud;
        doc.longitud = loci.longitud;
        doc.location.coordenadas = loci.location.coordenadas;
        result = doc.save(function (err, doc) {
            if (err) console.log(err);
            else {
                res.send("updated: " + JSON.stringify(result));
            }
        });
    });

});

router.delete("/:idlocalizacion", function (req, res) {
    let idLoc = req.params.idlocalizacion;
    Localizaciones.findByIdAndDelete(idLoc, function (err) {
        if (err) return handleError(err);
        res.send({ "nombre": "borrado ok!" });
    });

});

router.get('/search/:keyword', async (req, res) => {
    let keyword = req.params.keyword;
    console.log("buscando: " + keyword)

    let localizaciones = await Localizaciones.find({ "localizacion": { $regex: '.*' + keyword + '.*' } })
    if (localizaciones === undefined || localizaciones == null || localizaciones.length == 0) {
        keyword = keyword.toUpperCase();
        localizaciones = await Localizaciones.find({ "localizacion": { $regex: '.*' + keyword + '.*' } })

    }
    console.log("localizaciones encontradas: " + localizaciones);
    result = { status: "ok", data: localizaciones }
    res.send(
        result
    )
})

router.get('/', async (req, res) => {
    const localizaciones = await Localizaciones.find({})
    console.log("localizaciones encontradas: " + localizaciones)
    res.send(
        localizaciones
    )
})



module.exports = router;