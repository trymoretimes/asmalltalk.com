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

cd ~/Codes/asmalltalk.com/server && docker build -f devops/dockerfile -t ff-server .
cd ~/Codes/asmalltalk.com/client && docker build -f devops/dockerfile -t ff-client .
cd ~/Codes/asmalltalk.com/services/matcher && docker build -f devops/dockerfile -t ff-matcher .
cd ~/Codes/asmalltalk.com/services/mailer && docker build -f devops/dockerfile -t ff-mailer .
cd ~/Codes/asmalltalk.com/services/jobs && docker build -f devops/dockerfile -t ff-jobs .

# docker stop $(docker ps -a -q)
#
# docker run -p 5002:5002 -d ff-server
# # wait for server start
# sleep 20
# docker run -d ff-matcher
# docker run -d ff-mailer
# docker run -d ff-jobs
# docker run -p 80:80 -p 443:443 -v /etc/letsencrypt:/etc/letsencrypt -d ff-client
