// utils/errors.js
/**
 * Clase base para errores operacionales de la aplicación.
 * @param {string} message - El mensaje de error.
 * @param {number} statusCode - El código de estado HTTP.
 */
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true; // Para distinguir errores operacionales de bugs.

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Error para recursos no encontrados (404).
 */
export class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
    }
}

/**
 * Error para solicitudes incorrectas (400).
 */
export class BadRequestError extends AppError {
    constructor(message = 'Solicitud incorrecta') {
        super(message, 400);
    }
}

/**
 * Error para autenticación fallida o falta de autorización (401).
 */
export class UnauthorizedError extends AppError {
    constructor(message = 'No autorizado') {
        super(message, 401);
    }
}

export default AppError;