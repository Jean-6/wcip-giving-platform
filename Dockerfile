# Etape de build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./

RUN npm ci --include=dev

RUN npm install -g @angular/cli@21
COPY . .
RUN npm run build -- --configuration=production

# Execution de l'image
FROM nginx:1.25-alpine
COPY --from=build /app/dist/wcip-giving-platform/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
