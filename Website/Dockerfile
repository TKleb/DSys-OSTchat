# Reference: https://blog.logrocket.com/node-js-docker-improve-dx/

################################################################################
# Shared base image
################################################################################
# Get latest node-alpine
FROM node:17.9-alpine3.15 as base
RUN apk update && apk upgrade
WORKDIR /usr/app

# Make port reachable externally
EXPOSE 3030

################################################################################
# Production build
################################################################################
# Install dependencies
FROM base as production
ENV NODE_ENV=production
COPY package.json .
RUN npm install --production

# Copy over app files
COPY . ./

CMD [ "npm", "run", "start"]


################################################################################
# Test build
################################################################################
# Install dependencies
FROM base as test
ENV NODE_ENV=test
COPY package.json .
RUN npm install

# Copy over app files
COPY . ./

CMD [ "npm", "run", "test"]

################################################################################
# Development build
################################################################################
# Install dependencies
FROM base as development
ENV NODE_ENV=development
ENV DEBUG=nodejs-docker-express:*
RUN npm install -g nodemon
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy over app files
COPY . ./

CMD [ "npm", "run", "start"]
