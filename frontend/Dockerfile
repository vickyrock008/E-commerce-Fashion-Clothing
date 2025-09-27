# Stage 1: Build the React application
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# The VITE_API_URL should be set as an environment variable in your deployment platform
# For Docker Compose, this is handled in the docker-compose.yml file.
# If building manually, you can use: ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Serve the built application with a lightweight Nginx web server
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on port 80 by default
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]