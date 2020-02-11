# Lethe GraphQL Api

This is a GraphQL Api that is used with the Lethe React Native application.

[![Build Status on master][build-image-master]][build-url-master]

[build-image-master]:
  https://circleci.com/gh/sbardian/letheapi/tree/master.svg?style=shield&circle-token=1dcd6a2e19c580387624fe712bb94c0eb19480af
[build-url-master]: https://circleci.com/gh/sbardian/letheapi/tree/master

## Development:

```
docker-compose up
```

- graphql playground will be available at http://develop.localhost/graphql
- traefik dashboard will be available at http://traefik.localhost/
  > these sites will only work in Chrome

## Test:

```
docker-compose run test yarn test:watch
```

## Dependancies

If you need to add a dependency you will need to add it to the local host for
tooling and also to the container

### Local host

```
yarn add <dependancy>
```

### Container

```
docker-compose run dev yarn add <dependancy>
```
