"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorResponse = exports.logErrors = exports.errorHandler = exports.clientErrorHandler = void 0;
function clientErrorHandler(err, req, res, next) {
    if (req.xhr) {
        res.status(500).send({ error: 'Something failed!' });
    }
    else {
        next(err);
    }
}
exports.clientErrorHandler = clientErrorHandler;
function errorHandler(err, req, res, next) {
    res.status(500);
    res.render('error', { error: "Ops! Something really bad happened" });
}
exports.errorHandler = errorHandler;
function logErrors(err, req, res, next) {
    console.error(err.stack);
    next(err);
}
exports.logErrors = logErrors;
function errorResponse(errMessage, res, status = 400) {
    return res.status(status).json({
        error: errMessage
    });
}
exports.errorResponse = errorResponse;
