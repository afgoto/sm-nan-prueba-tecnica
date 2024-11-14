const axios = require('axios');  // Importamos Axios para hacer solicitudes HTTP
require('dotenv').config();

// Función para obtener los datos de la API externa
exports.fetchDataFromExternalAPI = async (type) => {
  try {
    // Verifica que el tipo de datos sea válido
    const validTypes = ['users', 'posts'];
    if (!validTypes.includes(type)) {
      throw new Error('Tipo de datos no válido. Usa "users" o "posts".');
    }

    const url = `${process.env.API_SERVICE_URL}${type}`;

    // Realiza la solicitud GET a la API externa
    const response = await axios.get(url);
    
    return response.data;
    
  } catch (error) {
    console.error('Error al obtener los datos de la API externa:', error);
    throw new Error('No se pudo obtener los datos de la API externa');
  }
};