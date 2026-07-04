FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/web/package.json ./apps/web/
RUN npm install --workspace=apps/web --ignore-scripts
COPY apps/web ./apps/web
ARG VITE_API_BASE_URL=/api
ARG VITE_POCKETBASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_POCKETBASE_URL=$VITE_POCKETBASE_URL
RUN npm run build --workspace=apps/web

FROM nginx:alpine
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
