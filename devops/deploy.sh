#!/bin/bash

set -e

email=h.minghe@gmail.com
domain=asmalltalk.com

# echo "enabling letsencrypt ${domain} with ${email}"
# docker run --rm -p 80:80 -p 443:443 \
#   -v /etc/letsencrypt:/etc/letsencrypt \
#   quay.io/letsencrypt/letsencrypt auth \
#   --standalone -m ${email} --agree-tos \
#     -d ${domain}

# echo "renew letsencrypt ${domain} with ${email}"
# docker run --rm -p 80:80 -p 443:443 \
#   -v /etc/letsencrypt:/etc/letsencrypt \
#   quay.io/letsencrypt/letsencrypt renew \
#   --standalone

docker build -f devops/dockerfile.client -t ff-client .
docker build -f devops/dockerfile.server -t ff-server .

# build matcher service
cd services/matcher && docker build -f devops/dockerfile -t ff-matcher

docker stop $(docker ps -a -q)

docker run -p 5002:5002 -d ff-server
docker run -d ff-matcher
docker run -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt -d ff-client
