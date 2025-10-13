#!/bin/bash

domains=(client1.folio.business api1.folio.business)
email="your-email@example.com"
rsa_key_size=4096
data_path="./data/certbot"
staging=0 # Set to 1 for testing

if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
fi

for domain in "${domains[@]}"; do
  echo "### Requesting certificate for $domain ..."
  docker compose run --rm --entrypoint "" certbot certbot certonly --webroot -w /var/lib/letsencrypt \
    --email $email -d $domain --rsa-key-size $rsa_key_size --agree-tos --force-renewal
done

docker compose up -d nginx
