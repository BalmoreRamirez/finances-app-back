// middleware/errorMiddleware.js
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Enviar una respuesta de error estandarizada
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        // Opcional: Incluir el stack de error solo en entorno de desarrollo
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack}),
    });
};

export default errorHandler;