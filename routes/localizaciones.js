const express = require('express')
const router = express.Router();
const Localizaciones = require('../models/localizaciones')


router.get("/:idlocalizacion", function (req, res) {
    res.send({"nombre":"esta es la localización 1"});
});

router.get('/', async (req, res) => {
    const localizaciones = await Localizaciones.find({})
    console.log(localizaciones)
    res.send(
        localizaciones
    )
})

module.exports = router;