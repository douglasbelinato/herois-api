const ContextStrategy = require('./db/strategies/base/contextStrategy')
const MongoDB = require('./db/strategies/mongodb')
const PostgresDB = require('./db/strategies/postgres')

const contextStrategyMongo = new ContextStrategy(new MongoDB())
const contextStrategyPostgres = new ContextStrategy(new PostgresDB())

contextStrategyMongo.create()
contextStrategyPostgres.create()
contextStrategyPostgres.read()
