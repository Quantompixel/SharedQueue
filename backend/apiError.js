class ApiError extends Error {
    httpStatusCode;

    constructor(errorMessage, httpStatusCode) {
        super(errorMessage);

        this.httpStatusCode = httpStatusCode;
    }
}

module.exports = ApiError;