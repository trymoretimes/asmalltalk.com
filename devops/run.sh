#!/bin/sh

set -e

email=h.minghe@gmail.com
domain=asmalltalk.com

echo "enabling letsencrypt ${domain} with ${email}"
docker run --rm -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt auth \
  --standalone -m ${email} --agree-tos \
    -d ${domain}

echo "renew letsencrypt ${domain} with ${email}"
docker run --rm -p 80:80 -p 443:443 \
  -v /etc/letsencrypt:/etc/letsencrypt \
  quay.io/letsencrypt/letsencrypt renew \
  --standalone


NODE_ENV=production npm run build && nginx -g 'daemon off;'
