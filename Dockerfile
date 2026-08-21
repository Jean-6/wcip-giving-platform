# Etape de build
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# Install local dependencies
RUN npm ci --include=dev
#Install Angular CLI
#RUN npm install -g @angular/cli
COPY . .
RUN npm run build -- --configuration=production

# Execution de l'image
FROM nginx:1.25-alpine
COPY --from=build /app/dist/wcip-giving-platform/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]
