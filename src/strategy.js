class NotImplementedException extends Error {
    constructor() {
        super('Not Implemented Exception')
    }
}

class ICrud {
    create(item) {
        throw new NotImplementedException()
    }

    read(query) {
        throw new NotImplementedException()
    }

    update(id, item) {
        throw new NotImplementedException()
    }

    delete(id) {
        throw new NotImplementedException()
    }
}

class MongoDB extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log("O item foi salvo no MongoDB")
    }
}

class PostgresDB extends ICrud {
    constructor() {
        super()
    }

    create(item) {
        console.log("O item foi salvo no Postgres")
    }
}

class ContextStrategy extends ICrud {
    constructor(strategy) {
        super()
        this._database = strategy
    }

    create(item) {
        return this._database.create(item)
    }

    read(query) {
        return this._database.read(query)
    }

    update(id, item) {
        return this._database.update(id, item)
    }

    delete(id) {
        return this._database.delete(id)
    }
}

// const contextStrategyDB = new ContextStrategy(new MongoDB())
const contextStrategyDB = new ContextStrategy(new PostgresDB())
contextStrategyDB.create()
contextStrategyDB.read()
