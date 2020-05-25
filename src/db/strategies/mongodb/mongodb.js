const ICrud = require('../interfaces/interfaceCrud')
// npm install mongoose
const Mongoose = require('mongoose')

class MongoDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._schema = schema
        this._connection = connection
    }

    async isConnected() {
        const STATUS = {
            0: 'Desconectado',
            1: 'Conectado',
            2: 'Conectando',
            3: 'Desconectando'
        }

        const state = STATUS[this._connection.readyState]
        
        if (state === 'Conectado') return true;

        if (state !== 'Conectando') return false;

        // Se ainda estiver conectando, aguarda mais 1 segundo
        console.log('time-out-test', parseInt(process.env.MONGO_DB_STARTUP_TIMEOUT_CONN))
        await new Promise(resolve => setTimeout(resolve, parseInt(process.env.MONGO_DB_STARTUP_TIMEOUT_CONN)))
        
        // Tenta verificar novamente se conectou
        return STATUS[this._connection.readyState] === 'Conectado';
    }

    static connect() {
        Mongoose.connect(process.env.MONGO_DB_URL,
            { useNewUrlParser: true, useUnifiedTopology: true }, function (error) {
                if (!error) return;
                console.error('Falha na conexão com o MongoDB!', error)
            })

        const connection = Mongoose.connection
        connection.once('open', () => console.log('MongoDB em execução e conexão realizada com sucesso!'))
        return connection
    }

    async create(item) {
        return await this._schema.create(item)
    }

    async read(query, skip=0, limit=10) {
        return this._schema.find(query).skip(skip).limit(limit)
    }

    async update(id, item) {
        return this._schema.updateOne({_id: id}, { $set: item})
    }

    async delete(id) {
        return this._schema.deleteOne({ _id: id})
    }
}

module.exports = MongoDB