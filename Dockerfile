# front-end build
FROM node:16 AS frontend

WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm ci

COPY ./frontend ./
RUN npm run prod

# actual build
FROM node:16

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
COPY faucet.js .

# run the app
CMD [ "node", "faucet.js"]
