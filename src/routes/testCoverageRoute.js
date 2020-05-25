const BaseRoute = require('./base/baseRoute')
const {join} = require('path')
const Joi = require('@hapi/joi')
const Boom = require('boom')

const failAction = (request, headers, erro) => {
    throw erro;
}

const headers = Joi.object({
    authorization: Joi.string().required()
}).unknown()

class TestCoverageRoute extends BaseRoute {
    coverage() {
        return {
            path: '/coverage/{params*}',
            method: 'GET',
            config: {
                auth: false
            },
            handler: {
                directory: {
                    path: join(__dirname, '../../coverage/'),
                    redirectToSlash: true,
                    index: true
                }
            }
        }
    }
}

module.exports = TestCoverageRoute