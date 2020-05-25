const assert = require('assert')
const PasswordHelper = require('../helpers/passwordHelper')

const SENHA = "app-pass"

describe('Suíte de testes para a criptografia de senhas', function() {
    it('Deve criptografar uma senha', async() => {
        const hash = await PasswordHelper.hashPassword(SENHA)
        assert.ok(await PasswordHelper.comparePassword(SENHA, hash))
    })

    it('Deve criticar senha inválida', async() => {
        const hash = await PasswordHelper.hashPassword(SENHA)
        assert.deepEqual(await PasswordHelper.comparePassword("OutraSenha", hash), false)
    })
})

