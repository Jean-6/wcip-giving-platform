# Stage 1 : Build Angular avec Node.js 20 Debian Slim (compatible avec esbuild / Angular 21)
FROM node:20-slim AS build
WORKDIR /app

# On definit NODE_ENV pour s'assurer que les devDependencies s'installent
ENV NODE_ENV=development

# 1. Copie des fichiers de dependances uniquement
COPY package.json package-lock.json ./

# 2. Installation de TOUTES les dependances (devDependencies incluses)
RUN npm ci

# 3. Copie du reste du code source
COPY . .

# 4. Compilation de la plateforme Angular 21
RUN npm run build -- --configuration=production

# Stage 2 : Image finale Nginx ultra-legere (~25 Mo)
FROM nginx:1.25-alpine

# Copie des fichiers compiles
COPY --from=build /app/dist/wcip-giving-platform/browser /usr/share/nginx/html

# Redirection SPA (evite les erreurs 404 lors du rafraichissement d'URL)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
