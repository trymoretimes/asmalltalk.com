#!/usr/bin/env bash

CURRENT_DIR="$(cd "$(dirname "$0")"; pwd -P)"
ROOT_DIR=$(cd "${CURRENT_DIR}/.."; pwd -P)

for dir in `ls ${ROOT_DIR}/services`; do
  echo "deploy ${dir}"
  cd ${ROOT_DIR}/services/${dir}
  docker login -u $DOCKER_USER -p $DOCKER_PASS
  docker build -t metrue/asmalltalk.${dir}:latest . && docker push metrue/asmalltalk.${dir}
done

# build client image and push to docker hub
cd ${ROOT_DIR}/client
docker build -f devops/dockerfile -t metrue/asmalltalk.client:latest .
docker push metrue/asmalltalk.client
