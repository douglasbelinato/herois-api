const assert = require('assert')
const MongoDB = require('../db/strategies/mongodb/mongodb')
const HeroiSchema = require('../db/strategies/mongodb/schemas/heroiSchema')
const Context = require('../db/strategies/base/contextStrategy')

let context = {}

const MOCK_HEROI_CADASTRAR = {
    nome: 'Homem-aranha',
    poder: 'Força, agilidade e sentido aranha'
}

const MOCK_HEROI_ATUALIZAR = {
    nome: 'Super Sam',
    poder: '$$$'
}

const MOCK_HEROI_EXCLUIR = {
    nome: 'Capitão América',
    poder: 'Super força'
}

describe.only('Testando MongoDB Strategy', function() {
    this.beforeAll(async () => {
        const connection = MongoDB.connect()
        context = new Context(new MongoDB(connection, HeroiSchema))
    })

    it('Verificar conexão', async () => {
        const result = await context.isConnected()
        assert.deepEqual(result, true)
    })

    it('Deve cadastrar um herói', async() => {
        const {nome, poder} = await context.create(MOCK_HEROI_CADASTRAR)
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })

    it('Deve consultar um herói', async() => {                
        const [{nome, poder}] = await context.read({ nome: MOCK_HEROI_CADASTRAR.nome}, 0);
        assert.deepEqual({nome, poder}, MOCK_HEROI_CADASTRAR)
    })

    it('Deve atualizar um herói', async() => {
        const heroiAtualizar = await context.create(MOCK_HEROI_ATUALIZAR);
        const result = await context.update(heroiAtualizar._id, {poder: 'Time is money'})
        assert.deepEqual(result.nModified, 1)
    })

    it('Deve excluir um herói', async() => {
        const heroiExcluir = await context.create(MOCK_HEROI_EXCLUIR)
        const result = await context.delete(heroiExcluir._id)
        assert.deepEqual(result.n, 1)
    })
})