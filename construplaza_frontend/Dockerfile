# ---------- ETAPA 1: BUILD ----------
FROM node:20-alpine AS build

# Directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Build del proyecto Vite
RUN npm run build

# ---------- ETAPA 2: SERVIDOR ----------
FROM nginx:alpine

# Eliminar config por defecto
RUN rm -rf /etc/nginx/conf.d/default.conf

# Copiar configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar build generado
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer puerto
EXPOSE 80

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]