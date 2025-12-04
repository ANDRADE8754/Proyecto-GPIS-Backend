# ========================================
# Dockerfile para Backend (Node.js/Express)
# ========================================

FROM node:20-alpine

# Directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear directorio para uploads
RUN mkdir -p uploads

# Puerto del backend (actualizado)
EXPOSE 3025

# Comando de inicio
CMD ["npm", "start"]
