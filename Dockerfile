# Etapa 1: Construcción de los archivos estáticos usando Node 20
FROM node:20 AS build
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
# Exponemos el puerto 80 para el balanceador
EXPOSE 80
# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]