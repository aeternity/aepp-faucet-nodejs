FROM node:20-alpine AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY src src
COPY tsconfig.json index.html ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit dev
COPY --from=frontend /app/dist dist
COPY server.ts .
ENV NODE_ENV production

CMD [ "npx", "tsx", "server.ts"]
