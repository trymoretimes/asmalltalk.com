#!/bin/sh

set -e

stage=$1

CURRENT_DIR="$(cd "$(dirname "$0")"; pwd -P)"
ROOT_DIR=$(cd "${CURRENT_DIR}/.."; pwd -P)

${ROOT_DIR}/node_modules/.bin/sls deploy -v \
  --stage ${stage} \
  --SENDGRID_API_KEY ${SENDGRID_API_KEY} \
  --ASMALLTALK_EMAIL ${ASMALLTALK_EMAIL} \
  --GITHUB_USERNAME ${GITHUB_USERNAME} \
  --GITHUB_PASSWORD ${GITHUB_PASSWORD}
