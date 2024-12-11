FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY ./src ./src

RUN npm run build --prod

FROM nginx:alpine

COPY --from=build /app/dist/weatherforecast-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
