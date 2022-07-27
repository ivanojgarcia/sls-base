'use strict';
const Logger = require('../utils/logger');

const logger = new Logger()
const { success, error } = require('../provider/http-response');

module.exports.handler = async (event, context) => {
    try {
        logger.info("Hello Handle");
        const body = "Serverless Success!"
        return success(body, 200)
    } catch (error) {
        console.log("ERROR ::: ", error)
        return error(error.message, 500);
    }
};