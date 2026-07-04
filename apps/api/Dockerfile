FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
COPY apps/api/package.json ./apps/api/
RUN npm install --workspace=apps/api --ignore-scripts
COPY apps/api ./apps/api
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "apps/api/src/index.js"]
