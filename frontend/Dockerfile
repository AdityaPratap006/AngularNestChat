# Stage 1: build
FROM node:14 AS development

WORKDIR /adityapratap/frontend/src/app

COPY package*.json ./

RUN npm install
RUN npm install -g @angular/cli@12.2.12

COPY . .

RUN npm run build

EXPOSE 4200 49153
