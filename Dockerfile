FROM node:20-alpine AS frontend

WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm ci

COPY ./frontend ./
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=frontend /app/dist/assets ./assets
COPY --from=frontend /app/dist/index.html ./templates/index.mustache
COPY faucet.mjs .

CMD [ "node", "faucet.mjs"]
