# base image 
FROM node:10-alpine as base
EXPOSE 9999
ENV PATH=/app/node_modules/.bin:$PATH
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json yarn.lock /app/
# install curl for health checks
RUN apk add --no-cache curl

# development image
FROM base as dev
ENV NODE_ENV=development

# development tests and ci image
FROM base as test
ENV NODE_ENV=test
# install git for jest watch
RUN apk add --no-cache git 

FROM base as prod
ENV NODE_ENV=production
RUN apk add --no-cache --virtual builds-deps build-base python
RUN yarn install && yarn cache clean
COPY ./dist /app/dist
COPY ./production-entrypoint.sh /app
RUN chmod +x /app/production-entrypoint.sh
USER node
CMD ["node", "/app/dist/index.js"]



# FROM node:10-stretch as test
# ENV NODE_ENV=test
# WORKDIR /app
# COPY package*.json yarn.lock ./
# RUN yarn install \
#     && yarn cache clean
# RUN apt-get install git -y
# COPY . .
# CMD ["yarn", "test", "--watch", "--onlyChanged", "--runInBand"]

# FROM base as prod
# CMD ["sh", "-c", "yarn", "build", "node", "/app/dist/index.js"]