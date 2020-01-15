#!/bin/sh

set -e

SL_DATABASE_URL=$(cat /run/secrets/prod_database_url)
SL_APOLLO_ENGINE_API_KEY=$(cat /run/secrets/apollo_api_key)
NOW_TOKEN=$(cat /run/secrets/now_token)
export SL_DATABASE_URL
export SL_APOLLO_ENGINE_API_KEY
export NOW_TOKEN

exec "$@"