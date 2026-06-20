# Etapa 1: Construcción de los archivos estáticos
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Esto generará la carpeta /dist con tu frontend optimizado
RUN npm run build 

# Etapa 2: Servidor Web Nginx
FROM nginx:alpine
# Copiamos lo que construimos en la Etapa 1 hacia el servidor web
COPY --from=build /app/dist /usr/share/nginx/html
# Exponemos el puerto 80, que es el que configuramos en tu balanceador de carga
EXPOSE 80
# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]