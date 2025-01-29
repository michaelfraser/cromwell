#!/bin/bash

source ../.env

URL="http://localhost:{$DOCKER_EXTERNAL_PORT}/health"

curl -X GET "$URL"