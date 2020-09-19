# Lethe GraphQL Api

This is a GraphQL Api that is used with the Lethe React Native application.

[![Build Status on master][build-image-master]][build-url-master]

[build-image-master]:
  https://circleci.com/gh/sbardian/letheapi/tree/master.svg?style=shield&circle-token=1dcd6a2e19c580387624fe712bb94c0eb19480af
[build-url-master]: https://circleci.com/gh/sbardian/letheapi/tree/master

## Development:

### Environment Variables

You must have the following environment variables set to run development
containers.

- NODE_ENV=development
- SL_APOLLO_ENGINE_API_KEY='your Apollo Engine API Key here'
- SL_DATABASE_URL='mongodb://mongo:27017/dev'
  - use whatever mongo server you like, this will be the local mongo container.
  - use the following command to connect to the mongo container
    - `docker exec -it letheapi_mongo_1 mongo`
- PORT=9999

### Build and run development environment

```
docker-compose up --detach --build
```

> Feel free to drop the --build, but use it for a fresh start on the images.

### Update dependencies

This command will update the dev environments dependancies.

```
docker-compose run --rm dev yarn install && yarn cache clean
```

### Once development environment is up, you can find check it at the following URL's

- graphql playground will be available at http://develop.localhost/graphql
- traefik dashboard will be available at http://traefik.localhost/
  > these sites will only route in Chrome

## Test:

Run tests and watch

```
docker-compose run test yarn test:watch
```

## Dependancies

If you need to add a dependency you will need to add it to the local host for
tooling and to the container.

### Local host

```
yarn add <dependancy>
```

> Failing to install the dependancy on the host could cause local tooling to not
> work.

### Container

```
docker-compose run dev yarn add <dependancy>
```

> Installing the dependancy in the container is most important, failure to do so
> will cause the app to fail on use of a new dependancy

## Production

### Secrets

You will need the following secrets defined in your swarm

- apollo_api_key
- sl_database_url
- now_token
- port

### Build image

```
docker build --label letheapi --tag letheapi_prod:0.0.4 --target prod .
```

### Deploy stack to swarm

```
docker stack deploy --compose-file docker-compose.prod.yml lethe-prod
```
