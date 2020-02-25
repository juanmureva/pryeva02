const express = require('express')
const router = express.Router();
const Localizaciones = require('../models/localizaciones')


router.get('/:localizacion', async (req, res) => {
    let localizacion=req.params.localizacion;
    console.log("buscando: "+localizacion)
    localizacion=localizacion.toUpperCase();
    console.log("buscando: "+JSON.stringify(localizacion))
    const localizaciones = await Localizaciones.find({"localizacion" : localizacion })
    console.log("localizaciones encontradas: "+localizaciones);
    result={status:"ok",data:localizaciones}
    res.send(
        result
    )
})

router.post("/", function (req, res) {
    console.log("petición recibida: "+JSON.stringify(req.body));
    var guardadatos = new Localizaciones(req.body);
    guardadatos.save();
    res.send({"nombre":"esta es la localización 1"});
});

router.put("/:idlocalizacion", function (req, res) {
    res.send({"nombre":"esta es la localización 1"});
});

router.delete("/:idlocalizacion", function (req, res) {
    res.send({"nombre":"esta es la localización 1"});
});

router.get('/search/:keyword', async (req, res) => {
    let keyword=req.params.keyword;
    console.log("buscando: "+keyword)
    
    let localizaciones = await Localizaciones.find({"localizacion" : { $regex: '.*'+keyword+'.*' } })
    if(localizaciones === undefined || localizaciones == null || localizaciones.length == 0)
    {
        keyword=keyword.toUpperCase();
        localizaciones = await Localizaciones.find({"localizacion" : { $regex: '.*'+keyword+'.*' } })

    }
    console.log("localizaciones encontradas: "+localizaciones);
    result={status:"ok",data:localizaciones}
    res.send(
        result
    )
})

router.get('/', async (req, res) => {
    const localizaciones = await Localizaciones.find({})
    console.log("localizaciones encontradas: "+localizaciones)
    res.send(
        localizaciones
    )
})



module.exports = router;