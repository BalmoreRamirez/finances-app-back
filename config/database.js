// config/database.js
import { Sequelize } from 'sequelize';
import 'dotenv/config';

const sequelize = new Sequelize(
    process.env.DB_DATABASE,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        port: process.env.DB_PORT,
        logging: false,
        define: {
            // Mapea createdAt y updatedAt a created_at y updated_at en la BD
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            // Evita que Sequelize pluralice los nombres de las tablas
            freezeTableName: true,
        }
    }
);

export default sequelize;