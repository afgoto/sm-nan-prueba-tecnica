
// Configura y exporta una instancia de Sequelize para conectar con PostgreSQL usando las credenciales del archivo .env.
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',          
  logging: true                 
});

// Sincroniza todos los modelos con la base de datos
sequelize.sync({ force: false }) // 'force: true' eliminaría y volvería a crear tablas si ya existen
  .then(() => {
    console.log("Tablas sincronizadas correctamente");
  })
  .catch((error) => {
    console.error("Error al sincronizar las tablas:", error);
  });

module.exports = sequelize;