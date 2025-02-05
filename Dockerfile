FROM node:20-alpine

LABEL maintainer="Rauliker <rauliker04@gmail.com>"

# Instalar PM2 para producción
RUN npm install pm2 -g

# Crear directorio de trabajo
WORKDIR /api

# Copiar archivos necesarios
COPY package*.json ./
COPY tsconfig*.json ./
COPY .env ./

# Instalar dependencias
RUN npm install -g @nestjs/cli && npm install

# Copiar código fuente
COPY ./src ./src

# Construir el proyecto
RUN npm run build

# Exponer puertos
EXPOSE 3000

# Iniciar la aplicación con PM2
CMD ["pm2-runtime", "start", "pm2.json"]
