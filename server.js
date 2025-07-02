// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/index.js';
import sequelize from './config/database.js';
import errorHandler from './middleware/errorMiddleware.js';

const app = express();

app.use(cors());
app.use(express.json());

// Ruta base para la API
app.use('/api', apiRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection has been established successfully.');

        // Sincroniza los modelos. Usa { force: true } en desarrollo para recrear tablas.
        await sequelize.sync({ alter: true });
        console.log("All models were synchronized successfully.");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

startServer();