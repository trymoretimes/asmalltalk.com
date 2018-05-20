#!/usr/bin/env bash

stage=$1

CURRENT_DIR="$(cd "$(dirname "$0")"; pwd -P)"
ROOT_DIR=$(cd "${CURRENT_DIR}/.."; pwd -P)

for dir in `ls ${ROOT_DIR}/services`; do
  echo "deploy ${dir} ${stage}"
  cd ${ROOT_DIR}/services/${dir}
  if [[ ${stage} == "production" ]];then
    if [ -e prod.config.json ];then
      cp prod.config.json config.json
    fi
  fi
  docker login -u $DOCKER_USER -p $DOCKER_PASS
  docker build -t metrue/asmalltalk.${dir}.${stage}:latest . && docker push metrue/asmalltalk.${dir}.${stage}
done

# build client image and push to docker hub
cd ${ROOT_DIR}/client
if [[ ${stage} == "production" ]];then
  if [ -e prod.config.js ];then
    cp prod.config.js config.js
  fi
fi
docker build -f devops/dockerfile -t metrue/asmalltalk.client.${stage}:latest .
docker push metrue/asmalltalk.client.${stage}
