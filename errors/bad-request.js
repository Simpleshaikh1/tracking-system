const {StatusCode} = require('http-status-codes');
const CustomApiError = require('./custom-api');

class BadRequestError extends CustomApiError {
    constructor(message){
        super(message)
        this.statusCode = StatusCode.BAD_REQUEST;
    }
}

module.exports = BadRequestError;