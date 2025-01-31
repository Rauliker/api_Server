FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias primero
COPY package*.json ./
# Asegúrate de copiar los dos archivos: package.json y package-lock.json (si existe)

# Instala las dependencias
RUN npm install

COPY . .

# Compila la aplicación
# RUN npm run build

# Exponer el puerto 3000
EXPOSE 3000

# Ejecutar la API
CMD ["npm", "run", "start:dev"]
