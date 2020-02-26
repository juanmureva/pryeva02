const mongoose = require('mongoose')
const Schema = mongoose.Schema

const HistoricoSchema = new Schema(
    {
      
    }
)

module.exports = mongoose.model('terremotos',HistoricoSchema)