#!/bin/sh
set -e

PORT=${PORT:-8080}
PROXY=${API_PROXY_URL:-http://api:3000}

sed -e "s|LISTEN_PORT|${PORT}|g" -e "s|API_PROXY_URL|${PROXY}|g" \
  /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
