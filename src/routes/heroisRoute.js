const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi')
const Boom = require('boom')

const failAction = (request, headers, erro) => {
    throw erro;
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class HeroisRoute extends BaseRoute {
    constructor(db) {
        super()
        this.db = db
    }

    list() {
        return {
            path: '/herois',
            method: 'GET',
            config: {
                description: 'Obtém a lista de heróis cadastrados',
                notes: 'Lista heróis',
                tags: ['api'],
                validate: {
                    // poderia ser assim tbm >>> failAction: failAction (como tem o mesmo nome dos dois lados, podemos simplificar)
                    failAction,
                    headers,
                    query: Joi.object({
                        skip: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(10),
                        nome: Joi.string().min(3).max(100)
                    })                    
                }
            },            
            handler: (request, headers) => {
                try {
                    let {skip, limit, nome} = request.query

                    let query = {}
                    if (nome) {
                        query = {
                            nome: {
                                $regex: `.*${nome}*.`
                            }
                        }
                    }
                                        
                    if (skip === undefined) {
                        skip = 0
                    }

                    if (limit === undefined) {
                        limit = 10
                    }

                    return this.db.read(query, parseInt(skip), parseInt(limit))
                } catch (error) {
                    console.error('Ocorreu um erro', error)
                    return Boom.internal()
                }                
            }
        }
    }

    create() {
        return {
            path: '/herois',
            method: 'POST',
            config: {
                description: 'Cadastra um herói',
                notes: 'Cadastra herói',
                tags: ['api'],
                validate: {
                    failAction,
                    headers,
                    payload: Joi.object({
                        nome: Joi.string().required().min(3).max(100),
                        poder: Joi.string().required().min(2).max(50),
                    })
                }
            },
            handler: async (request) => {
                try {
                    const {nome, poder} = request.payload
                    return await this.db.create({nome, poder})
                } catch(error) {
                    console.error('Ocorreu um erro', error)
                    return Boom.internal()
                }
            }
        }
    }

    update() {
        return {
            path: '/herois/{id}',
            method: 'PATCH',
            config: {
                description: 'Atualiza um herói',
                notes: 'Atualiza herói',
                tags: ['api'],
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    }),
                    payload: Joi.object({
                        nome: Joi.string().min(3).max(100),
                        poder: Joi.string().min(2).max(50),
                    })
                }
            },
            handler: async (request) => {
                try {
                    const {id} = request.params

                    // Técnica para remover atributos não inicializados
                    const dadosString = JSON.stringify(request.payload)
                    const dados = JSON.parse(dadosString)

                    return await this.db.update(id, dados)
                } catch(error) {
                    console.error('Ocorreu um erro', error)
                    return Boom.internal()
                }
            }
        }
    }

    delete() {
        return {
            path: '/herois/{id}',
            method: 'DELETE',
            config: {
                description: 'Exclui um herói',
                notes: 'Exclui herói',
                tags: ['api'],
                validate: {
                    failAction,
                    headers,
                    params: Joi.object({
                        id: Joi.string().required()
                    })
                }
            },
            handler: async (request) => {
                try {
                    const {id} = request.params
                    return await this.db.delete(id)
                } catch (error) {
                    console.error('Ocorreu um erro', error)
                    return Boom.internal()
                }
            }
        }
    }
}

module.exports = HeroisRoute