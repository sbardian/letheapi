# base image 
FROM node:10-alpine as base
EXPOSE 9999
ENV PATH=/app/node_modules/.bin:$PATH
WORKDIR /app

# development image
FROM base as dev
ENV NODE_ENV=development

# development tests and ci image
FROM base as test
ENV NODE_ENV=test
# install git for jest watch
RUN apk add --no-cache git 

FROM test as test_ci

# Builder for production
FROM base as prod-builder
ENV NODE_ENV=production
COPY package*.json yarn.lock /app/
RUN apk add --no-cache python make g++
RUN yarn install --frozen-lockfile && yarn cache clean

# Production image build
FROM base as prod
ENV NODE_ENV=production
COPY --from=prod-builder /app/node_modules /app/node_modules
COPY ./dist /app/dist
COPY production-entrypoint.sh package.json /app/
RUN chmod +x /app/production-entrypoint.sh
USER node
CMD ["node", "/app/dist/index.js"]