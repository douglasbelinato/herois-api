// npm install mongoose
const Mongoose = require('mongoose')

Mongoose.connect('mongodb://heroiapp:pass@localhost:27017/herois',
                    { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
                        if (!error) return;
                        console.error('Falha na conexão com o MongoDB!', error)
                    })

const connection = Mongoose.connection
connection.once('open', () => console.log('MongoDB em execução e conexão realizada com sucesso!'))

console.log('state', connection.readyState)

// Modelo da coleção
const heroiSchema = new Mongoose.Schema({
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

// seta a definição do modelo
const heroisModel = Mongoose.model('herois', heroiSchema)

async function main() {
    const resultCadastrar = await heroisModel.create({
        nome: 'Batman',
        poder: 'Dinheiro'
    })

    const listItens = await heroisModel.find()

}

main()