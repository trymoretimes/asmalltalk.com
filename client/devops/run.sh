#!/bin/sh

NODE_ENV=production npm run build && nginx -g 'daemon off;'
