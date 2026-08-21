# Build stage
FROM node:20-alpine AS build
WORKDIR /app

ENV NODE_ENV=development

# Copy manifests first for layer caching
COPY package.json package-lock.json ./

RUN npm ci

# Copy source after installing deps
COPY . .


# Use the LOCAL ng (from node_modules/.bin) instead of a global CLI
RUN npm run build -- --configuration=production

# Execution de l'image

FROM nginx:1.25-alpine

COPY --from=build /app/dist/wcip-giving-platform/browser /usr/share/nginx/html

RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
