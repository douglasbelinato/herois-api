const Mongoose = require('mongoose')

// Modelo da coleção
const heroisSchema = new Mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    poder: {
        type: String,
        required: true
    },
    insertAt: {
        type: Date,
        default: new Date()
    }
})

// Expõe publicamente a definição do modelo
module.exports = Mongoose.model('herois', heroisSchema)