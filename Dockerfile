FROM node:18 as base
WORKDIR /app
COPY . .
RUN npm install -g lerna
RUN npm install --legacy-peer-deps
RUN lerna run build --scope=@otoge.app/shared

FROM base as base-api
RUN lerna run build --scope=@otoge.app/api

FROM base-api as api
EXPOSE 3000
CMD lerna run start --scope=@otoge.app/api

FROM base as base-web
#ENV REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyBQzjeZMmOMg3_oEaKf1Ef2q80QgXwKbWk
#ENV REACT_APP_API_BASE_URL=https://otoge.app
RUN lerna run build --scope=@otoge.app/web

FROM base-web as web
WORKDIR /app
EXPOSE 8080
CMD lerna run start --scope=@otoge.app/web
