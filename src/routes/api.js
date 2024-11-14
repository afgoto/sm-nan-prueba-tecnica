const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');  // Controlador de datos

//-----

router.post('/external-data', dataController.fetchExternalData);
//---
router.get('/data/', dataController.getAllData);
router.get('/data/users', dataController.getAllUsers);
router.get('/data/posts', dataController.getAllPosts);
//---
router.get('/export-csv', dataController.exportCSV);

module.exports = router;