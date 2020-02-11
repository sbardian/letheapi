# Lethe GraphQL Api

This is a GraphQL Api that is used with the Lethe React Native application.

[![Build Status on master][build-image-master]][build-url-master]

[build-image-master]:
  https://circleci.com/gh/sbardian/letheapi/tree/master.svg?style=shield&circle-token=1dcd6a2e19c580387624fe712bb94c0eb19480af
[build-url-master]: https://circleci.com/gh/sbardian/letheapi/tree/master

## Development:

```
docker-compose up --detach --build
```

Update dependencies

```
docker-compose run --rm dev yarn install && yarn cache clean
```

- graphql playground will be available at http://develop.localhost/graphql
- traefik dashboard will be available at http://traefik.localhost/
  > these sites will only route in Chrome

## Test:

```
docker-compose run test yarn test:watch
```

### Dependancies

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

Build image

```
docker build --label letheapi --tag letheapi_prod:0.0.4 --target prod .
```

Deploy stack to swarm

```
docker stack deploy --compose-file docker-compose.prod.yml lethe-prod
```
