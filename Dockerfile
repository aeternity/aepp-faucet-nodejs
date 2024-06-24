FROM node:20-alpine AS frontend

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY src src
COPY public public
COPY src-server src-server
COPY tsconfig.json tsconfig.server.json vite.config.ts index.html ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit dev
COPY --from=frontend /app/dist dist
COPY --from=frontend /app/dist-server dist-server
ENV NODE_ENV production
ARG REVISION
ENV REVISION $REVISION

CMD [ "node", "dist-server/main.js"]
