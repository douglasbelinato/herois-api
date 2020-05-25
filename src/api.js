// npm i @hapi/hapi @hapi/vision @hapi/inert @hapi/joi -save
// npm i hapi-swagger -save
// npm i jsonwebtoken
// npm i hapi-auth-jwt2

// npm install node-gyp
// npm install bcrypt

// Exemplos - Hapi JS com Swagger: 
// https://medium.com/@saivarunk/creating-api-routes-with-swagger-documentation-for-hapi-js-36c663df936d
// https://github.com/glennjones/hapi-swagger

// npm i dotenv cross-env

const { config } = require('dotenv')
const { join } = require('path')
const { ok } = require('assert')

const env = process.env.NODE_ENV || "dev"

ok(env === "prod" || env === "dev", "A variável de ambiente env é inválida. Deve ser prod ou dev")

const configPath = join(__dirname, '../config', `.env.${env}`)

// Injeta a configuração
config({
    path: configPath
})

console.log('==============================================')
console.log('Iniciando api.js - Ambiente: ', env)
console.log('==============================================')

const Context = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb/mongodb')
const Postgres = require('./db/strategies/postgres/postgres')
const HeroiSchema = require('./db/strategies/mongodb/schemas/heroiSchema')
const UsuarioSchema = require('./db/strategies/postgres/schemas/usuarioSchema')

const Hapi = require('@hapi/hapi')
const HeroisRoute = require('./routes/heroisRoute')
const AuthRoute = require('./routes/authRoute')
const TestCoverageRoute = require('./routes/testCoverageRoute')

const HapiSwagger = require('hapi-swagger');
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');

const HapiAuthJwt2 = require('hapi-auth-jwt2')
const JWT_SECRET = process.env.JWT_SECRET

const swaggerOptions = {
    info: {
        title: 'Test API Documentation',
        version: '0.0.1'
    }
};

const app = new Hapi.Server({
    port: process.env.API_PORT
})

function mapRoutes(instance, methods) {
    // No Node, essas chamadas são equivalentes:
    // new HeroisRoute().list()
    // new HeroisRoute()['list']
    return methods.map(method => instance[method]())
}

async function main() {
    const connection = MongoDB.connect()
    const context = new Context(new MongoDB(connection, HeroiSchema))

    const connectionPostgres = await Postgres.connect()
    const model = await Postgres.defineModel(connectionPostgres, UsuarioSchema)
    const contextPostgres = new Context(new Postgres(connectionPostgres, model))

    // Registra no server os módulos
    await app.register([
        HapiAuthJwt2,
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }]);

    // define a estratégia de autenticação das requisições na API
    app.auth.strategy('jwt-auth', 'jwt', {
        key: JWT_SECRET,
        // options: {
        //     expiresIn: 20
        // },
        validate: async (dado, request) => {
            // Mesmo com um token válido em mãos, podemos configurar checagens adicionais.
            // É útil, por exemplo, caso o cliente tenha um token válido mas seu acesso seja revogado 
            // no banco de dados. Então nós criamos esse double check para impedir o consumo
            // dos recursos da API
            console.log('dado-->', dado)
            const [result] = await contextPostgres.read({
                username: dado.username.toLowerCase()
            })

            if (!result) {
                return {
                    isValid: false
                }
            }
            
            return {                
                isValid: true
            }
        }
    })
    
    app.auth.default('jwt-auth')

    app.route([
        ...mapRoutes(new AuthRoute(JWT_SECRET, contextPostgres), AuthRoute.methods()),
        ...mapRoutes(new HeroisRoute(context), HeroisRoute.methods()),
        ...mapRoutes(new TestCoverageRoute(), TestCoverageRoute.methods())
    ])
    
    await app.start()
    console.log('Servidor executando na porta', app.info.port)

    return app
}

module.exports = main()