

console.log("Accediendo al server")
console.log("--------------------")

const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./src/routes/api'); 

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear el cuerpo de la solicitud
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Usa las rutas definidas en src/routes/api.js
app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});