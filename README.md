## Pre-requisites

- [Make](https://en.wikipedia.org/wiki/Make_(software))
- [Docker](https://www.docker.com) tested on 27.4.0
- [Curl](https://curl.se/docs/manpage.html)

These are only needed on your machine if you want to run the integeration tests for the APIs.
- [Npm](https://www.npmjs.com) tested on 10.8.2
- [Node](https://nodejs.org/en) tested with v18.20.6

## Getting started

To ease the setup for the project.  The APIs will run in Node and Mongo docker containers

There are a number of useful commands which have been abstracted into a `Makefile`.  To see a list of useful commands run `make` and a list of commands similar to the below should be displayed.

```
help                           This help.
up                             Create the Docker containers
down                           Stop and remove Docker containers
restart                        Remove and recreate the Docker containers
nuke                           Delete all docker containers and rebuild
bash                           Create a bash session in the webserver container
database                       Create a bash session in the database container
logs-web                       Display webserver logs
test-integration               Run integration tests from the host machine
```

## Run development environment

To start the development environment run the following make command.  This will setup the docker containers and run the npm install.

`make up`

##  Sanity check

Verify the application is working correctly by running a simple sanity tests

1. `cd bin && ./health.sh`

You should receive a json response similar to the below:

```
{"message":"API is running fine!"}
```

2. cd bin && ./register_user.sh

You should receive a json response similar to the below:

```
{
  "message": "User registered successfully",
  "user": {
    "name": "John Doe",
    "email": "john.doe@test.com",
    "password": "$2b$10$hO619rTISaNeGXelbjBRyeSYDBPyZnhD8pWd8wbYo//NasqGwbMdW",
    "_id": "6798eccc3a6af999c7218eb1",
    "createdAt": "2025-01-28T14:42:20.315Z",
    "updatedAt": "2025-01-28T14:42:20.315Z",
    "__v": 0
  }
}
```

##  Integration tests

There are a number of integation tests of the APIs in the `tests/integration` folder which can be run with:

`make test-integration`

---
Please review this document as we progress through the project and make sure that instructions are still valid.
Last reviewed by Michael Fraser on 28/01/2025