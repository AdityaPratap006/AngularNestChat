# Specify node version and image
# Name image development (can be anything)
FROM node:14 AS development

# Specify working directory inside the container
WORKDIR /adityapratap/src/app

# Copy package.json and package-lock.json from host to inside container working directory
COPY package*.json ./

# Install deps inside container
RUN npm install

RUN npm run build

EXPOSE 3000

################
## PRODUCTION ##
################
# Build another image named production
FROM node:14 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Set working dir
WORKDIR /adityapratap/src/app

COPY --from=development /adityapratap/src/app .

EXPOSE 3000

# run app
CMD ["node", "dist/main"]