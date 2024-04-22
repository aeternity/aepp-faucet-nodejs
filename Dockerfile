# front-end build
FROM node:20-alpine AS frontend

WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm ci

COPY ./frontend ./
RUN NODE_OPTIONS=--openssl-legacy-provider npm run prod

# actual build
FROM node:20-alpine

# use app directory
WORKDIR /app

# copy package.json & package-lock.json
COPY package*.json ./
# install production dependencies
RUN npm ci --only=production
# copy generated assets
COPY --from=frontend /app/assets ./assets
# copy generated index page
COPY --from=frontend /app/templates ./templates
# copy node files
COPY faucet.mjs .

# run the app
CMD [ "node", "faucet.mjs"]
