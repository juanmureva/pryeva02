const mongoose = require('mongoose')
const Schema = mongoose.Schema

const LocalizacionSchema = new Schema(
    {
       localizacion : String,
       desc: String,
       latitud: Number,
       longitud: Number,
       location: {
        // It's important to define type within type field, because
        // mongoose use "type" to identify field's object type.
        type: {type: String, default: 'Point'},
        // Default value is needed. Mongoose pass an empty array to
        // array type by default, but it will fail MongoDB's pre-save
        // validation.
        coordinates: {type: [Number], default: [0, 0]}
    }
    }
)

module.exports = mongoose.model('localizaciones',LocalizacionSchema)