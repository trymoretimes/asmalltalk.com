#!/bin/bash

docker stop $(docker ps -a -q)
docker build -f devops/dockerfile.client -t ff-client .
docker run -p 80:80 -d ff-client
docker build -f devops/dockerfile.server -t ff-server .
docker run -p 5002:5002 -d ff-server
