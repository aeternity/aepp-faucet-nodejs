FROM node:20-alpine AS frontend

WORKDIR /app
COPY ./frontend/package*.json ./
RUN npm ci

COPY ./frontend ./
RUN NODE_OPTIONS=--openssl-legacy-provider npm run prod

FROM node:20-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY --from=frontend /app/assets ./assets
COPY --from=frontend /app/templates ./templates
COPY faucet.mjs .

CMD [ "node", "faucet.mjs"]
