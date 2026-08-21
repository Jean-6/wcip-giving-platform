# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Forcer l'installation de toutes les dépendances (y compris devDependencies)
ENV NODE_ENV=

# Copy manifests first for layer caching
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for the build)
RUN npm ci --include=dev

RUN npm install @angular/cli

# Copy source after installing deps
COPY . .


# Use the LOCAL ng (from node_modules/.bin) instead of a global CLI
RUN ./node_modules/.bin/ng build --configuration=production

# Execution de l'image

FROM nginx:1.25-alpine

COPY --from=build /app/dist/wcip-giving-platform/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
