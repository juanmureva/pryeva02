const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocalizacionSchema = new Schema(
    {
       nombre : String,
       desc: String
    }
)

module.exports = mongoose.model('localizaciones',LocalizacionSchema)