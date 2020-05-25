// Conectando no db do mongo via terminal:
docker exec -it mongodb mongo -u heroiapp -p pass --authenticationDatabase herois

// exibe tds os databases
show dbs

// seta o database a ser utilizado
use herois

// visualiza todas as collections (de documentos)
show collections

// Insere dados
db.herois.insert({
    nome: 'Flash',
    poder: 'Velocidade',
    dataNascimento: '1989-05-05'
})

// Consulta dados
db.herois.find()

// Consulta dados e retorna dados formatados
db.herois.find().pretty()

// POdemos usar algumas sintaxes javascript dentro do mongo tbm. Exemplo: laços for
for (let i=0; i < 100; i++) {
    db.herois.insert({
        nome: `Herói-${i}`,
        poder: `Velocidade`,
        dataNascimento: '1989-05-05'
    })   
}

// Retorna qts objetos tem em uma collections
db.herois.count()

// Retorna apenas um
db.herois.findOne()

// Ordenando de forma decrescente, retorne os resultados limitados a 5 objetos apenas
db.herois.find().limit(5).sort({nome: -1})

// Busca com where, selecionando apenas o atributo poder
db.herois.find({nome: 'Flash'}, { poder: 1})

// Busca sem where, selecionando apenas o atributo poder
db.herois.find({}, { poder: 1})

// Busca sem where, selecionando apenas o atributo poder e retirando o atributo id (que vem no resultado por default)
db.herois.find({}, { poder: 1, _id: 0})

// Alterando um objeto - dessa forma aqui, só ficará o atributo nome, e os demais atributos do Flash, serão
// removidos. Isso porque não passamos eles 
db.herois.update({_id: ObjectId("5eaf06e07194c9c2d5aad44a")}, {nome: 'Mercúrio'})

// Alterando um objeto - dessa forma aqui, Atualizamos o que é preciso e mantemos os demais campos 
db.herois.update({_id: ObjectId("5eaf07727194c9c2d5aad44c")}, { $set: {nome: 'Spider-man'} } )


// Alterando objeto que tenha determinado poder para outro valor - só altera 1 por vez. Se quiser alterar
// todos que tenham o poder do where, então é preciso informar uma flag no comando
db.herois.update({ poder: 'Velocidade'}, { $set: {poder: 'Super força'} } )

// remove todos
db.herois.remove({})