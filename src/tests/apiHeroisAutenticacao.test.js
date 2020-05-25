const assert = require('assert')
const api = require('../api')
const Boom = require('boom')
const Jwt = require('jsonwebtoken')
let app = {}
const JWT_SECRET = 'SECRET'

const USUARIO = {
    username: "app-user",
    password: "app-pass"
}

const USUARIO_NAO_CADASTRADO = {
    username: "user-not-registered",
    password: "app-pass"
}

const USUARIO_COM_SENHA_INVALIDA = {
    username: "app-user",
    password: "invalid-pass"
}

const USUARIO_OBRIGATORIO = {
    username: "",
    password: "app-pass"
}

const SENHA_OBRIGATORIO = {
    username: "app-user",
    password: ""
}

describe('Suíte de testes para a autenticação da API de Heróis', function() {
    this.beforeAll(async() => {
        app = await api
    })

    it('Deve realizar login e obter um token JWT válido', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USUARIO
        })

        const { token }  = JSON.parse(result.payload)
        assert.ok(Jwt.verify(token, JWT_SECRET))
    })

    it('Não deve realizar login - Obrigatório informar o usuário', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USUARIO_OBRIGATORIO
        })

        const { statusCode }  = JSON.parse(result.payload)
        assert.deepEqual(statusCode, Boom.badRequest().output.statusCode)
    })

    it('Não deve realizar login - Obrigatório informar a senha', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: SENHA_OBRIGATORIO
        })

        const { statusCode }  = JSON.parse(result.payload)
        assert.deepEqual(statusCode, Boom.badRequest().output.statusCode)
    })

    it('Não deve realizar login - usuário não existe', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USUARIO_NAO_CADASTRADO
        })

        const { statusCode }  = JSON.parse(result.payload)
        assert.deepEqual(statusCode, Boom.unauthorized().output.statusCode)
    })

    it('Não deve realizar login - senha inválida', async() => {
        const result = await app.inject({
            method: 'POST',
            url: '/login',
            payload: USUARIO_COM_SENHA_INVALIDA
        })

        const { statusCode }  = JSON.parse(result.payload)
        assert.deepEqual(statusCode, Boom.unauthorized().output.statusCode)
    })
})