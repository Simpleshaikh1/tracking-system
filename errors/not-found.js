const { StatusCode } = require('http-status-codes');

const CustomApiError = require('./custom-api');

class NotFoundError extends CustomApiError{
    constructor(message){
        super(message)
        this.statusCode = StatusCode.NOT_FOUND;
    }
}

module.exports = NotFoundError;