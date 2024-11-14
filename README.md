
# Proyecto de Prueba Técnica - SearchMAS

Esta prueba técnica consiste en crear una pequeña API con **Node.js**, utilizando **PostgreSQL** como base de datos y **Sequelize** como ORM. El objetivo es demostrar el manejo de Node.js, consumo de APIs externas, manejo de base de datos y generación de archivos CSV.

### Candidato
Alejandro Gonzalez Tonelli

---


## Descripción de la API de Servicios utilizada

La API utiliza el servicio de [jsonplaceholder.typicode.com](https://jsonplaceholder.typicode.com/) para obtener información de **Usuarios** y sus **Posts** ficticios relacionados. La relación entre las entidades es de uno a muchos:

- **User** (1) --- * **Posts** (N)


### Modelos

- **Users**  
  Campos:
    - `id`: Identificador único del usuario
    - `name`: Nombre completo del usuario
    - `username`: Nombre de usuario único
    - `email`: Correo electrónico del usuario (valido según formato de email)
    - `phone`: Teléfono del usuario
    - `website`: Sitio web personal del usuario

- **Posts**  
  Campos:
    - `id`: Identificador único del post
    - `userId`: ID del usuario al que pertenece el post
    - `title`: Título del post
    - `body`: Cuerpo del post

---

## Instrucciones para Ubuntu 22.04 LTS

### Principales Herramientas y Módulos Utilizados

- **Docker** (27.3.1 o version mas reciente)
- **Node.js** (versión más reciente)
- **Sequelize** (ORM para PostgreSQL)
- **PostgreSQL** (a través de contenedor Docker)
- **Postman** (para probar la API)

### Dependencias

```json
{
    "dependencies": {
        "axios": "^1.3.3",
        "csv-writer": "^1.6.0",
        "dotenv": "^16.0.0",
        "express": "^4.21.1",
        "pg": "^8.8.0",
        "pg-hstore": "^2.3.4",
        "sequelize": "^6.33.0"
    }
}
```

# Proyecto

Este proyecto se basa en una aplicación que utiliza Docker y PostgreSQL, con una API desarrollada en Node.js para interactuar con la base de datos.

## Pasos para Configurar y Ejecutar el Proyecto

### 1. Buildear el Proyecto y Levantar los Servicios

Ejecuta el siguiente comando para descargar, construir y levantar los contenedores definidos en `docker-compose.yml`:

`docker-compose up --build`

Otra opción para asegurar una compilación limpia:

`docker-compose build --no-cache`

`docker-compose up`

### 2. Restaurar el Entorno (Opcional)

Si necesitas eliminar contenedores y reiniciar el entorno desde cero, puedes ejecutar:

`docker-compose down -v`

**Nota:** Esto detendrá y eliminará los contenedores. Los volúmenes de datos, como los de PostgreSQL, no se eliminarán a menos que uses el flag `-v`.

`docker image rm prueba_tecnica` (Opcional)

## Endpoints de la API

- **POST /external-data**: Carga datos externos desde la API en la base de datos.
  
- **GET /data/**: Devuelve todos los datos de usuarios y posts.

- **GET /data/users**: Devuelve una lista de todos los usuarios.

- **GET /data/posts**: Devuelve una lista de todos los posts.

- **GET /export-csv**: Exporta todos los datos de la base de datos en un archivo CSV llamado `user_posts.csv` en la carpeta raíz. El archivo incluye:
  - Cantidad de posts de cada usuario.
  - Cantidad de palabras de cada post.

## Interacción con la API

Se incluye una colección de **Postman** para facilitar la interacción con la API.

1. Primero, ejecuta el endpoint `POST /external-data` para cargar los datos en la base de datos.
2. Luego, utiliza los demás endpoints según tus necesidades.

## Estructura de Contenedores

- **PostgreSQL**: Configurado en Docker y accesible en el puerto 5432.
- **Node.js**: Aplicación configurada para ejecutarse en el puerto 3000 y conectarse a PostgreSQL mediante la variable de entorno `DATABASE_URL`.
