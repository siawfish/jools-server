import { ErrorRequestHandler, Request, Response, NextFunction } from "express"

export function clientErrorHandler (err:ErrorRequestHandler, req:Request, res:Response, next:NextFunction) {
    if (req.xhr) {
      res.status(500).send({ error: 'Something failed!' })
    } else {
      next(err)
    }
}

export function errorHandler (err:ErrorRequestHandler, req:Request, res:Response, next:NextFunction) {
    res.status(500)
    res.render('error', { error: "Ops! Something really bad happened" })
}

export function logErrors (err:Error, req:Request, res:Response, next:NextFunction) {
    console.error(err.stack)
    next(err)
}

export function errorResponse (errMessage: string, res:Response, status=400) {
  return res.status(status).json({
    error: errMessage
  })
}