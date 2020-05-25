const BaseRoute = require('./base/baseRoute')
const Joi = require('@hapi/joi')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')
const PasswordHelper = require('../helpers/passwordHelper')

const failAction = (request, headers, erro) => {
    throw erro;
}

class AuthRoute extends BaseRoute {
    constructor(secret, db) {
        super()
        this.db = db
        this.secret = secret
    }

    login() {
        return {
            path: '/login',
            method: 'POST',
            config: {
                auth: false,
                description: 'Realiza login na aplicação',
                notes: 'Login',
                tags: ['api'],
                validate: {
                    // poderia ser assim tbm >>> failAction: failAction (como tem o mesmo nome dos dois lados, podemos simplificar)
                    failAction,
                    payload: Joi.object({
                        username: Joi.string().required(),
                        password: Joi.string().required()
                    })
                }
            },            
            handler: async (request, headers) => {     
                const {username, password} = request.payload

                const [usuario] = await this.db.read({
                    username: username.toLowerCase()
                })

                if (!usuario) {
                    return Boom.unauthorized("Usuário não encontrado")
                }                
                
                const matchPass = await PasswordHelper.comparePassword(password, usuario.password)

                if (!matchPass) {
                    return Boom.unauthorized("Usuário ou senha inválido")
                }

                const token = Jwt.sign({
                    username: username,
                    id: 1
                }, this.secret)

                return {token}
            }
        }
    }
}

module.exports = AuthRoute