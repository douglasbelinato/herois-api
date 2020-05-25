const assert = require('assert')
const Postgres = require('../db/strategies/postgres/postgres')
const HeroiSchema = require('../db/strategies/postgres/schemas/heroiSchema')
const Context = require('../db/strategies/base/contextStrategy')

let context = {}
const MOCK_HEROI_CADASTRAR = {
    nome: 'Homem-aranha',
    poder: 'Força, agilidade e sentido aranha'
}
const MOCK_HEROI_ATUALIZAR = {
    nome: 'Batman',
    poder: 'Dinheiro'
}
const MOCK_HEROI_DELETAR = {
    nome: 'Hulk',
    poder: 'Super força'
}

describe('Testando Postgres Strategy', function() {
    // Como pode haver uma certa demora para conectar no banco, definimos
    // que ele pode levar o tempo que for necessário
    this.timeout(Infinity)

    this.beforeAll(async () => {
        const connection = await Postgres.connect()
        const model = await Postgres.defineModel(connection, HeroiSchema)
        context = new Context(new Postgres(connection, model))
        await context.delete() // limpa a base de testes
    })
    
    it('Deve validar a conexão com o banco de dados PostgresSQL', async () => {
        const result = await context.isConnected()
        assert.equal(result, true)
    })

    it('Deve cadastrar um herói', async () => {
        const result = await context.create(MOCK_HEROI_CADASTRAR)
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })

    it('Deve listar um herói', async () => {
        const [result] = await context.read({nome: MOCK_HEROI_CADASTRAR.nome})
        delete result.id
        assert.deepEqual(result, MOCK_HEROI_CADASTRAR)
    })
    it('Deve atualizar um herói', async () => {
        await context.create(MOCK_HEROI_ATUALIZAR)
        
        const [result] = await context.read({nome: MOCK_HEROI_ATUALIZAR.nome})
        
        // no js temos uma técnica chamada rest/spread que é um método usado para
        // mergear objetos ou separá-los
        const heroiAtualizar = {
            ...MOCK_HEROI_ATUALIZAR,
            nome: 'Homem de ferro'
        }
        
        await context.update(result.id, heroiAtualizar)
        const [heroiAtualizado] = await context.read({nome: heroiAtualizar.nome})
        
        assert.deepEqual(heroiAtualizar.nome, heroiAtualizado.nome)
    })
    it('Deve deletar um herói', async () => {
        const heroiCadastrado = await context.create(MOCK_HEROI_DELETAR)
        const result = await context.delete(heroiCadastrado.id)
        
        assert.deepEqual(result, 1)
    })
})