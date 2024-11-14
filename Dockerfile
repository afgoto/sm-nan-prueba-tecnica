# Usa la imagen base de la versión más reciente de Node.js
FROM node:current

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install --verbose

# Copia el resto de los archivos de la aplicación al contenedor
COPY . .

# Expone el puerto de la aplicación (por ejemplo, el puerto 3000)
EXPOSE 3000

# Define el comando para iniciar la aplicación
CMD ["npm", "start"]