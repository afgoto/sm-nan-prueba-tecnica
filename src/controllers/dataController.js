const externalAPI = require('../services/externalAPI');  // Lógica para la API externa
const sequelize = require('../config/database');  // Configuración de la base de datos
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const fs = require('fs');
const User = require('../models/User');  // Modelo de datos de usuarios
const Post = require('../models/Post');  // Modelo de datos de posts

//-----

// Función que obtiene y guarda datos de usuarios y posts de una API externa en la base de datos.
exports.fetchExternalData = async (req, res) => {
  try {
    // Llamada al servicio que obtiene los datos de la API externa
    const externalDataUsers = await externalAPI.fetchDataFromExternalAPI('users');
    const externalDataPosts = await externalAPI.fetchDataFromExternalAPI('posts');

    // Procesar y guardar datos de usuarios
    console.log('Datos obtenidos de la API externa (Usuarios):', externalDataUsers);
    for (let userData of externalDataUsers) {
      const existingUser = await User.findByPk(userData.id);  // Verificar si el usuario ya existe
      if (!existingUser) {
        await User.create({
          id: userData.id,
          name: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone,
          website: userData.website
        });
      }
    }

    // Procesar y guardar datos de posts
    console.log('Datos obtenidos de la API externa (Posts):', externalDataPosts);
    for (let postData of externalDataPosts) {
      const existingPost = await Post.findByPk(postData.id);  // Verificar si el post ya existe
      if (!existingPost) {
        await Post.create({
          id: postData.id,
          userId: postData.userId,
          title: postData.title,
          body: postData.body
        });
      }
    }

    // Devolver la respuesta con los datos obtenidos
    res.status(200).json({
      message: 'Información de Usuarios y Posts obtenida correctamente',
      users: externalDataUsers, 
      posts: externalDataPosts   
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error al procesar los datos',
      error: error.message
    });
  }
};

//-----

// Función que obtiene y devuelve todos los usuarios y posts de la base de datos.
exports.getAllData = async (req, res) => {
  try {

    const [users, posts] = await Promise.all([
      User.findAll(),  
      Post.findAll()   
    ]);
    
    // Devuelve la respuesta con los usuarios y los posts
    res.status(200).json({
      message: 'Usuarios y posts obtenidos correctamente',
      data: {
        users,
        posts
      }
    });
  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).json({
      message: 'Error al obtener los usuarios y posts',
      error: error.message
    });
  }
};

//-----

// Función que obtiene y devuelve todos los usuarios de la base de datos.
exports.getAllUsers = async (req, res) => {
  try {

    const users = await User.findAll(); 
    

    res.status(200).json({
      message: 'Usuarios obtenidos correctamente',
      data: users
    });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({
      message: 'Error al obtener los usuarios',
      error: error.message
    });
  }
};

//-----

// Función que obtiene y devuelve todos los posts de la base de datos.
exports.getAllPosts = async (req, res) => {
  try {

    const posts = await Post.findAll(); 
    
    res.status(200).json({
      message: 'Posts obtenidos correctamente',
      data: posts
    });
  } catch (error) {
    console.error('Error al obtener los posts:', error);
    res.status(500).json({
      message: 'Error al obtener los posts',
      error: error.message
    });
  }
};

//-----

// Función que exporta todos los datos de usuarios y posts a un archivo CSV.
exports.exportCSV = async (req, res) => {
  try {

    const users = await User.findAll();
    const posts = await Post.findAll();

    const usersJson = users.map(user => user.toJSON());
    const postsJson = posts.map(post => post.toJSON());

    // Crear un diccionario con la cantidad de posts de cada usuario
    const userPostCounts = usersJson.reduce((acc, user) => {
      acc[user.id] = postsJson.filter(post => post.userId === user.id).length;
      return acc;
    }, {});

    // Combinar los datos de usuarios y posts en un solo array
    const combinedData = usersJson.map(user => {
      // Buscar los posts del usuario
      const userPosts = postsJson.filter(post => post.userId === user.id);

      // Si el usuario tiene posts, combinarlos con los datos del usuario
      if (userPosts.length > 0) {
        return userPosts.map(post => ({
          userId: user.id,
          postCount: userPostCounts[user.id],          
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
          postId: post.id,
          postTitle: post.title,
          postBody: post.body,
          wordCount: post.body.split(' ').length       
        }));
      } else {
        // Si no tiene posts, solo agregar los datos del usuario
        return [{
          userId: user.id,
          postCount: userPostCounts[user.id], 
          name: user.name,
          username: user.username,
          email: user.email,
          phone: user.phone,
          website: user.website,
          postId: '',
          postTitle: '',
          postBody: '',         
          wordCount: 0                                  
        }];
      }
    }).flat();

    // Crear escritor CSV con las nuevas columnas
    const csvWriter = createCsvWriter({
      path: 'users_posts.csv',
      header: [
        { id: 'userId', title: 'Usuario ID' },
        { id: 'postCount', title: 'Cantidad de Posts' },  
        { id: 'name', title: 'Nombre' },
        { id: 'username', title: 'Usuario' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Teléfono' },
        { id: 'website', title: 'Sitio Web' },
        { id: 'postId', title: 'Post ID' },
        { id: 'postTitle', title: 'Título del Post' },
        { id: 'postBody', title: 'Cuerpo del Post' },
        { id: 'wordCount', title: 'Cantidad de Palabras' }
      ]
    });

    // Escribir los datos combinados en el archivo CSV
    await csvWriter.writeRecords(combinedData);

    // Devolver el archivo CSV como respuesta para que el cliente lo descargue
    res.download('users_posts.csv', 'users_posts.csv', (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err);
        res.status(500).send('Error al descargar el archivo.');
      } else {
        console.log('Archivo CSV generado y descargado');
      }
    });

  } catch (error) {
    console.error('Error al generar el CSV:', error);
    res.status(500).json({
      message: 'Error al generar el archivo CSV',
      error: error.message
    });
  }
};

