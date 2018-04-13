#!/bin/bash

target='root@172.104.86.178'
ssh -o "StrictHostKeyChecking no" ${target} <<END
  docker rmi \$(docker images --filter "dangling=true" -q --no-trunc)
  cd ~/ff
  docker build -f devops/dockerfile.client -t ff-client .
  docker run -p 80:80 -d ff-client
  docker build -f devops/dockerfile.server -t ff-server
  docker run -p 5002:5002
END
