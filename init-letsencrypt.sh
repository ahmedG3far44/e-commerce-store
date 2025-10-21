#!/usr/bin/env bash
set -euo pipefail

# Usage:
# sudo ./deploy_project.sh /path/to/project subdomain project_id_or_name HOSTED_ZONE_ID [domain]
#
# Example:
# sudo ./deploy_project.sh /home/ubuntu/my-app app_unique_id my-app Z123ABCXYZ456 folio.business

PROJECT_DIR="$1"
SUBDOMAIN="$2"
PROJECT_ID="$3"
HOSTED_ZONE_ID="$4"
DOMAIN="${5:-folio.business}"
WWW_ROOT="/var/www/apps"
NGINX_SITES_AVAILABLE="/etc/nginx/sites-available"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
START_PORT=3000   # first port to try for server apps
AWS_CLI="$(command -v aws || true)"

if [[ -z "$AWS_CLI" ]]; then
  echo "ERROR: aws cli not found in PATH. Install and configure aws cli before running."
  exit 1
fi

# Helper: find a free port starting from START_PORT
find_free_port() {
  local port=$START_PORT
  while ss -ltn | awk '{print $4}' | grep -q ":$port\$"; do
    port=$((port+1))
    if (( port > 65500 )); then
      echo "No free ports available" >&2
      return 1
    fi
  done
  echo "$port"
}

# Helper: choose package manager
choose_pkg_mgr() {
  if [[ -f "$PROJECT_DIR/yarn.lock" ]]; then
    echo "yarn"
  else
    echo "npm"
  fi
}

# Helper: read package.json fields
pkg_json() {
  jq -r "$1" "$PROJECT_DIR/package.json" 2>/dev/null || echo ""
}

# Validate inputs
if [[ ! -d "$PROJECT_DIR" ]]; then
  echo "Project directory does not exist: $PROJECT_DIR"
  exit 1
fi

if [[ ! -f "$PROJECT_DIR/package.json" ]]; then
  echo "No package.json found in project dir: $PROJECT_DIR"
  exit 1
fi

# Detect project type (priority: next -> nest -> express -> react)
IS_NEXT=false
IS_NEST=false
IS_EXPRESS=false
IS_REACT=false

# Extract dependencies from package.json
PKG_DEPS=$(jq -r '(.dependencies // {}) + (.devDependencies // {}) | keys | .[]' "$PROJECT_DIR/package.json" 2>/dev/null || echo "")

# Detect project type
if grep -q "\"next\"" "$PROJECT_DIR/package.json" || [[ -f "$PROJECT_DIR/next.config.js" ]]; then
  IS_NEXT=true
elif echo "$PKG_DEPS" | grep -q "^@nestjs/core$" || [[ -f "$PROJECT_DIR/nest-cli.json" ]]; then
  IS_NEST=true
elif [[ -n "$PKG_DEPS" ]] && (echo "$PKG_DEPS" | grep -q "^express$" || [[ -f "$PROJECT_DIR/server.js" ]] || [[ -f "$PROJECT_DIR/src/main.js" ]]); then
  IS_EXPRESS=true
elif echo "$PKG_DEPS" | grep -q "^react$" || \
     { [[ -f "$PROJECT_DIR/tsconfig.json" ]] && grep -q "\"react\"" "$PROJECT_DIR/package.json" 2>/dev/null; }; then
  IS_REACT=true
fi

# For CRA React apps package.json usually has "react-scripts"
if ! $IS_REACT && jq -r '.scripts // {} | keys[]' "$PROJECT_DIR/package.json" 2>/dev/null | grep -q "react-scripts"; then
  IS_REACT=true
fi

# If multiple flags true, prioritize Next > Nest > Express > React
PROJECT_TYPE=""
if $IS_NEXT; then PROJECT_TYPE="next"; fi
if $IS_NEST; then PROJECT_TYPE=${PROJECT_TYPE:-"nest"}; fi
if $IS_EXPRESS; then PROJECT_TYPE=${PROJECT_TYPE:-"express"}; fi
if $IS_REACT; then PROJECT_TYPE=${PROJECT_TYPE:-"react"}; fi

if [[ -z "$PROJECT_TYPE" ]]; then
  echo "Unsupported project type. Allowed: React, Next, Express, NestJS. Exiting."
  exit 1
fi

echo "Detected project type: $PROJECT_TYPE"

# Create destination folder
DEST_DIR="$WWW_ROOT/${PROJECT_ID}"
mkdir -p "$DEST_DIR"
chown -R "$USER":"$USER" "$DEST_DIR" || true

# Install dependencies
pushd "$PROJECT_DIR" > /dev/null
PKG_MGR=$(choose_pkg_mgr)
echo "Using package manager: $PKG_MGR"

if [[ "$PKG_MGR" == "yarn" ]]; then
  command -v yarn >/dev/null || ( echo "yarn not installed. Install yarn or remove yarn.lock." && exit 1 )
  yarn install --frozen-lockfile
else
  npm ci || npm install
fi

# Build if needed
if [[ "$PROJECT_TYPE" == "react" || "$PROJECT_TYPE" == "next" ]]; then
  echo "Running build..."
  if [[ "$PKG_MGR" == "yarn" ]]; then
    yarn build
  else
    npm run build
  fi
fi

# Deploy built files or start server
if [[ "$PROJECT_TYPE" == "react" ]]; then
  # Most CRA builds to build/ by default
  BUILD_DIR_CANDIDATES=("build" "dist" ".next")
  BUILD_DIR=""
  for d in "${BUILD_DIR_CANDIDATES[@]}"; do
    if [[ -d "$PROJECT_DIR/$d" ]]; then BUILD_DIR="$PROJECT_DIR/$d"; break; fi
  done
  if [[ -z "$BUILD_DIR" ]]; then
    echo "Build folder not found for React app. Expected build/ or dist/." >&2
    exit 1
  fi
  rm -rf "$DEST_DIR"/*
  cp -r "$BUILD_DIR"/* "$DEST_DIR"/
  echo "React static files copied to $DEST_DIR"
  # nginx will serve static
  SERVER_PORT=""
elif [[ "$PROJECT_TYPE" == "next" ]]; then
  # For Next.js we have two deployment strategies: static export or Node server
  # Check if next.config.js has output: 'export' (static) or user used `next export`
  if [[ -d "$PROJECT_DIR/out" ]]; then
    # next export produced static out/
    rm -rf "$DEST_DIR"/*
    cp -r "$PROJECT_DIR/out"/* "$DEST_DIR"/
    echo "Next static export copied to $DEST_DIR"
    SERVER_PORT=""
  else
    # We'll run Next as a Node server with pm2
    PORT=$(find_free_port)
    echo "Assigning port $PORT to Next server"
    export PORT
    # Create .env.production or .env with PORT
    echo "PORT=$PORT" > "$PROJECT_DIR/.env.production"
    # Use pm2 to run build and start
    if [[ "$PKG_MGR" == "yarn" ]]; then
      yarn build
      pm2 start yarn --name "$PROJECT_ID" -- start --env production
    else
      npm run build
      pm2 start npm --name "$PROJECT_ID" -- start --env production
    fi
    pm2 save
    SERVER_PORT="$PORT"
  fi
elif [[ "$PROJECT_TYPE" == "express" || "$PROJECT_TYPE" == "nest" ]]; then
  # For server apps we run under pm2
  PORT=$(find_free_port)
  echo "Assigning port $PORT to server"
  echo "PORT=$PORT" > "$PROJECT_DIR/.env"
  # If Nest and uses npm run start:prod prefer that
  if [[ "$PKG_MGR" == "yarn" ]]; then
    pm2 start yarn --name "$PROJECT_ID" -- start
  else
    # try start:prod then start
    if jq -r '.scripts["start:prod"]' package.json >/dev/null 2>&1; then
      pm2 start npm --name "$PROJECT_ID" -- run start:prod
    else
      pm2 start npm --name "$PROJECT_ID" -- start
    fi
  fi
  pm2 save
  SERVER_PORT="$PORT"
  # Optionally copy entire source to DEST_DIR for reference
  rsync -a --exclude node_modules "$PROJECT_DIR"/ "$DEST_DIR"/
fi

popd > /dev/null

# ----------------------------
#  Create/UPSERT DNS record (A) using AWS CLI
# ----------------------------
# Get public IP of this machine
PUBLIC_IP=$(curl -s https://checkip.amazonaws.com || true)
if [[ -z "$PUBLIC_IP" ]]; then
  echo "Could not determine public IP for DNS record. Exiting."
  exit 1
fi
RECORD_NAME="${SUBDOMAIN}.${DOMAIN}."
TTL=300

CHANGE_JSON=$(mktemp)
cat > "$CHANGE_JSON" <<EOF
{
  "Comment": "Add/Update A record for ${RECORD_NAME}",
  "Changes": [
    {
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "${RECORD_NAME}",
        "Type": "A",
        "TTL": ${TTL},
        "ResourceRecords": [
          { "Value": "${PUBLIC_IP}" }
        ]
      }
    }
  ]
}
EOF

echo "Applying DNS record for ${RECORD_NAME} -> ${PUBLIC_IP}"
aws route53 change-resource-record-sets \
  --hosted-zone-id "$HOSTED_ZONE_ID" \
  --change-batch "file://${CHANGE_JSON}"

rm -f "$CHANGE_JSON"
echo "DNS change submitted. Allow TTL/propagation time."

# ----------------------------
# Create nginx config per type
# ----------------------------
NGINX_CONF_NAME="${PROJECT_ID}.${DOMAIN}"
NGINX_CONF_PATH="${NGINX_SITES_AVAILABLE}/${NGINX_CONF_NAME}"

echo "Writing nginx config to $NGINX_CONF_PATH"

if [[ "$PROJECT_TYPE" == "react" || ( "$PROJECT_TYPE" == "next" && -d "$PROJECT_DIR/out" ) ]]; then
  # Serve static files from DEST_DIR via nginx
  cat > "$NGINX_CONF_PATH" <<NGCONF
server {
    listen 80;
    server_name ${SUBDOMAIN}.${DOMAIN};

    root ${DEST_DIR};
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    access_log /var/log/nginx/${PROJECT_ID}_access.log;
    error_log  /var/log/nginx/${PROJECT_ID}_error.log;
}
NGCONF
elif [[ -n "${SERVER_PORT:-}" ]]; then
  # Reverse proxy to pm2 server on SERVER_PORT
  cat > "$NGINX_CONF_PATH" <<NGCONF
upstream ${PROJECT_ID}_upstream {
    server 127.0.0.1:${SERVER_PORT};
}

server {
    listen 80;
    server_name ${SUBDOMAIN}.${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${SERVER_PORT};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }

    access_log /var/log/nginx/${PROJECT_ID}_access.log;
    error_log  /var/log/nginx/${PROJECT_ID}_error.log;
}
NGCONF
else
  echo "Could not determine how to configure nginx for project type: $PROJECT_TYPE" >&2
  exit 1
fi

# Enable site
ln -sf "$NGINX_CONF_PATH" "${NGINX_SITES_ENABLED}/${NGINX_CONF_NAME}"

# Test and reload nginx
nginx -t
systemctl reload nginx

# ----------------------------
# Obtain SSL certificate with certbot --nginx
# ----------------------------
echo "Requesting/renewing certificate via certbot for ${SUBDOMAIN}.${DOMAIN}"
if ! command -v certbot >/dev/null 2>&1; then
  echo "certbot not installed. Install certbot with nginx plugin and rerun."
  exit 1
fi

# Use certbot non-interactive
certbot --nginx -d "${SUBDOMAIN}.${DOMAIN}" --non-interactive --agree-tos -m "admin@${DOMAIN}" || {
  echo "certbot failed. Check logs or run interactively to troubleshoot."
}

# Reload nginx to apply cert
systemctl reload nginx

echo "Deployment finished for ${PROJECT_ID} -> ${SUBDOMAIN}.${DOMAIN}"
if [[ -n "${SERVER_PORT:-}" ]]; then
  echo "App proxied on port ${SERVER_PORT} and managed by pm2 (name: ${PROJECT_ID})"
fi
echo "Public IP used for DNS: ${PUBLIC_IP}"
