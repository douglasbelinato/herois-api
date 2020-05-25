const Mongoose = require('mongoose')
const assert = require('assert')
const api = require('./../api')
const Boom = require('boom')
let app = {}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Chapolin Colorado',
    poder: 'Marreta Bionica'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Goku',
    poder: 'Super Sayajin'
}

const MOCK_HEROI_EXCLUIR = {
    nome: 'Vegeta',
    poder: 'Super Sayajin'
}

const headers = {
    Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFwcC11c2VyIiwiaWQiOjEsImlhdCI6MTU5MDE2OTgyM30.UjRTrPUKtTLAclNKwzZ_a9MeT7ZrduUp5L7VQrSKrR0'
}

describe('Suíte de testes para a API de Heróis', function() {
    this.beforeAll(async() => {
        app = await api
    })

    it('Não deve listar heróis sem informar o token JWT - GET /herois', async() => {
        const result = await app.inject({
            method: 'GET',
            url: '/herois'
        })

        const {statusCode} = JSON.parse(result.payload)
        assert.deepEqual(statusCode, Boom.unauthorized().output.statusCode)
    })

    it('Deve listar heróis - GET /herois', async() => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois'
        })
        
        const dados = JSON.parse(result.payload)
        assert.ok(Array.isArray(dados))
    })

    it('Deve paginar 1 herói - GET /herois?skip=0&limit=1', async() => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=0&limit=1'
        })

        const dados = JSON.parse(result.payload)
        assert.deepEqual(dados.length, 1)
    })

    it('Deve gerar erro com parâmetro limit inválido - GET /herois?skip=0&limit=teste', async() => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?limit=teste'
        })

        assert.deepEqual(result.statusCode, 400)
    })

    it('Deve gerar erro com parâmetro skip inválido - GET /herois?skip=0&skip=teste', async() => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?skip=teste'
        })

        assert.deepEqual(result.statusCode, 400)
    })

    it('Deve gerar erro com parâmetro nome inválido - GET /herois?nome=H', async() => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?nome=H'
        })

        assert.deepEqual(result.statusCode, 400)
    })

    it('Deve buscar herói pelo nome completo - GET /herois?nome=Homem-aranha', async() => {
        const result = await app.inject({
            method: 'GET',
            headers,
            url: '/herois?nome=Homem-aranha'
        })        
        
        assert.ok(JSON.parse(result.payload).length >= 1)
    })

    it('Deve cadastrar um herói - POST /herois', async() => {
        const result = await app.inject({
            method: 'POST',
            headers,
            url: '/herois',
            payload: MOCK_HEROI_CADASTRAR
        })

        const {nome, poder} = JSON.parse(result.payload)
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })

    it('Deve atualizar parcialmente um herói - PATCH /herois/{id}', async() => {
        const resultCadastrar = await app.inject({
            method: 'POST',
            headers,
            url: '/herois',
            payload: MOCK_HEROI_ATUALIZAR
        })

        const heroiCadastrado = JSON.parse(resultCadastrar.payload)        

        const resultAtualizar = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${heroiCadastrado._id}`,
            payload: {poder: 'Super Sayajin 2'}
        })

        assert.deepEqual(resultAtualizar.result.nModified, 1)
    })

    it('Não deve atualizar parcialmente um herói com id incorreto- PATCH /herois/{id}', async() => {
        const resultAtualizar = await app.inject({
            method: 'PATCH',
            headers,
            url: `/herois/${Mongoose.Types.ObjectId(3)}`,
            payload: {poder: 'Super Sayajin 2'}
        })

        assert.ok(resultAtualizar.result.nModified === 0)
    })

    it('Deve lançar erro informando id incorreto MongoDB- PATCH /herois/{id}', async() => {
        const resultAtualizar = await app.inject({
            method: 'PATCH',
            headers,
            url: '/herois/1}',
            payload: {poder: 'Super Sayajin 2'}
        })

        assert.deepEqual(resultAtualizar.statusCode, 500)
    })

    it('Deve excluir um herói com id - DELETE /herois/{id}', async() => {
        const resultCadastrar = await app.inject({
            method: 'POST',
            headers,
            url: '/herois',
            payload: MOCK_HEROI_EXCLUIR
        })

        const heroiCadastrado = JSON.parse(resultCadastrar.payload)        

        const resultDeletar = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${heroiCadastrado._id}`
        })

        assert.deepEqual(resultDeletar.result.deletedCount, 1)
    })

    it('Não deve excluir um herói com id incorreto - DELETE /herois/{id}', async() => {
        const resultDeletar = await app.inject({
            method: 'DELETE',
            headers,
            url: `/herois/${Mongoose.Types.ObjectId(3)}`
        })
        
        assert.ok(resultDeletar.result.deletedCount === 0)
    })
})
