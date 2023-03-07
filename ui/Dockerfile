FROM node:17-alpine3.12 as build

RUN adduser -D ci2
WORKDIR /app
COPY . .
RUN chown ci2:ci2 /app
USER ci2
RUN npm install
RUN npm run build

FROM node:17-alpine3.12 as final
COPY --from=build /app /app

RUN apk update && apk upgrade
RUN adduser -D ci2
RUN chown ci2:ci2 /app

WORKDIR /app
USER ci2
ENTRYPOINT ["npm", "start"]
