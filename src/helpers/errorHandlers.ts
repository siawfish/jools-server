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

interface PostgresError {
  code?: string;
  detail?: string;
  constraint_name?: string;
}

export const formatDbError = (error: PostgresError | string): string => {
  // If error is just a string, return it directly
  if (typeof error === 'string') {
    return error;
  }

  // Handle specific Postgres error codes
  switch (error.code) {
    case '23505': // unique_violation
      // Extract the field name from the constraint name or detail
      const field = error.constraint_name?.split('_')[1] || 
                   error.detail?.match(/\(([^)]+)\)/)?.[1] || 
                   'field';
      return `This ${field} is already in use`;

    case '23503': // foreign_key_violation
      return 'Referenced record does not exist';

    case '23502': // not_null_violation
      return 'Required field is missing';

    case '22P02': // invalid_text_representation
      return 'Invalid data format';

    case '28P01': // invalid_password
      return 'Invalid credentials';

    case '42P07': // relation_already_exists
      return 'Table or relation already exists';

    default:
      // For unknown errors, return a generic message
      return 'An unexpected database error occurred';
  }
};