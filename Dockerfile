# Build stage
FROM node:20-alpine AS build
WORKDIR /app

ENV NODE_ENV=development

# Copy manifests first for layer caching
COPY package.json package-lock.json ./

RUN npm ci --include=dev

# Copy source after installing deps
COPY . .


# Use the LOCAL ng (from node_modules/.bin) instead of a global CLI
RUN npx ng build --configuration=production

# Execution de l'image

FROM nginx:1.25-alpine

COPY --from=build /app/dist/wcip-giving-platform/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
