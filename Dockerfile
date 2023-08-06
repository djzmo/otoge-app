FROM node:18 as base
WORKDIR /app
COPY . .
RUN npm install -g lerna
RUN npm install --legacy-peer-deps
RUN lerna run build --scope=@otoge.app/shared

FROM base as base-api
RUN lerna run build --scope=@otoge.app/api

FROM node:18 as api
WORKDIR /app
COPY --from=base-api /app/packages/api/package.json .
COPY --from=base-api /app/packages/api/package-lock.json .
COPY --from=base-api /app/packages/api/data/ ./data
COPY --from=base-api /app/packages/api/dist/ ./dist
COPY --from=base-api /app/node_modules/ ./node_modules
EXPOSE 3000
CMD npm start

FROM base as base-web
# ENV REACT_APP_GOOGLE_MAPS_API_KEY=
# ENV REACT_APP_API_BASE_URL=
RUN lerna run build --scope=@otoge.app/web

FROM node:18 as web
WORKDIR /app
COPY --from=base-web /app/packages/web/package.json .
COPY --from=base-web /app/packages/web/package-lock.json .
COPY --from=base-web /app/packages/web/build/ ./build
COPY --from=base-web /app/node_modules ./node_modules
EXPOSE 8080
CMD npm start
