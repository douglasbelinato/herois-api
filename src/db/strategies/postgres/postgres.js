const ICrud = require('../interfaces/interfaceCrud')
const Sequelize = require('sequelize')

class PostgresDB extends ICrud {
    constructor(connection, schema) {
        super()
        this._connection = connection
        this._schema = schema
    }

    async isConnected() {
        try {
            await this._connection.authenticate()
            return true          
        } catch(error) {
            console.error('Ocorreu um erro!!!', error)
            return false
        }
    }

    static async connect() {
        const postgressSsl = process.env.POSTGRES_SSL == "true"
        console.log(postgressSsl === false)
        const connection = new Sequelize(process.env.POSTGRES_URL, {
                quoteIdentifiers: false,
                operatorsAliases: false,
                logging: false,
                ssl: postgressSsl,
                dialectOptions: {
                    ssl: postgressSsl
                }
            }
        )

        return connection
    }

    static async defineModel(connection, schema) {
        const model = connection.define(
            schema.name, schema.schema, schema.options
        )
        // Sincroniza com a base
        await model.sync()
        return model
    }

    async create(item) {
        const {dataValues} = await this._schema.create(item)
        return dataValues
    }

    // item = {}
    // Se item vier nulo, assume {} como default
    async read(item = {}) {
        return this._schema.findAll({where: item, raw: true})
    }

    async update(id, item) {
        return this._schema.update(item, { where: {id} })
    }

    async delete(id) {
        const query = id ? { id } : {}
        return this._schema.destroy({where: query})
    }
}

module.exports = PostgresDB