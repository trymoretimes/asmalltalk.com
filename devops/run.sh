#!/bin/sh

set -e
NODE_ENV=production npm run build && nginx -g 'daemon off;'
