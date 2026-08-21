# Stage 1 : Build Angular 21
FROM node:20-slim AS build
WORKDIR /app

# Expliciter l'ajout du dossier .bin au PATH système du conteneur
ENV PATH=/app/node_modules/.bin:$PATH

# Copie des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation en forçant les devDependencies et en réactivant les liens symboliques
RUN npm ci --include=dev --unsafe-perm

# Copie du code source
COPY . .

# Exécution du build Angular
RUN npm run build -- --configuration=production

# Stage 2 : Serveur Web Nginx
FROM nginx:1.25-alpine

COPY --from=build /app/dist/wcip-giving-platform/browser /usr/share/nginx/html

# Redirection SPA pour éviter les erreurs 404
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
