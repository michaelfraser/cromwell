#!/bin/bash

source ../.env
# Define variables
URL="http://localhost:{$DOCKER_EXTERNAL_PORT}/user/register"
DATA='{
  "name": "John Doe",
  "email": "john.doe@test.com",
  "password": "J0hnDoe!"
}'

# Make the curl request
curl -X POST "$URL" \
-H "Content-Type: application/json" \
-d "$DATA"
