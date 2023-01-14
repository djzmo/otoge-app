FROM node:18 as builder
WORKDIR /app
COPY package.json lerna.json ./
RUN npm install -g lerna
RUN npm install
COPY . .

FROM builder as base-dev
RUN lerna bootstrap
RUN lerna run build --scope=@otoge.app/shared

FROM builder as base-prod
RUN lerna bootstrap -- --production
RUN lerna run build --stream --parallel

FROM node:18 as api
WORKDIR /app
COPY --from=base-prod /app/packages/api/package.json ./
COPY --from=base-prod /app/packages/api/dist/ ./
COPY --from=base-prod /app/packages/api/package-lock.json ./
COPY --from=base-prod /app/packages/api/node_modules ./
EXPOSE 3000
CMD npm start

FROM node:18 as web
WORKDIR /app
COPY --from=base-prod /app/packages/web/package.json ./
COPY --from=base-prod /app/packages/web/build/ ./
COPY --from=base-prod /app/packages/web/package-lock.json ./
COPY --from=base-prod /app/packages/web/node_modules ./
EXPOSE 8080
CMD npm start
