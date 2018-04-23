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

cd ~/ff/server && docker build -f devops/dockerfile -t ff-server .
cd ~/ff/client && docker build -f devops/dockerfile -t ff-client .
cd ~/ff/services/matcher && docker build -f devops/dockerfile -t ff-matcher .
cd ~/ff/services/mailer && docker build -f devops/dockerfile -t ff-mailer .
cd ~/ff/services/jobs && docker build -f devops/dockerfile -t ff-jobs .

docker stop $(docker ps -a -q)

docker run -p 5002:5002 -d ff-server
# wait for server start
sleep 20
docker run -d ff-matcher
docker run -d ff-mailer
docker run -d ff-jobs
docker run -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt -d ff-client
