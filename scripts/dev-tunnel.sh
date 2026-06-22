#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BE_ROOT="$(cd "$ROOT/../anno-bot-be" && pwd)"
NGROK_CONFIG="$ROOT/ops/ngrok.dev.yml"

GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

cleanup() {
	echo ""
	echo "Shutting down ngrok..."
	pkill ngrok 2>/dev/null || true
	exit 0
}
trap cleanup SIGINT SIGTERM

ensure_services() {
	if ! pgrep -f "vite.*dev.*3000" > /dev/null; then
		echo "Starting frontend dev server..."
		(cd "$ROOT" && pnpm dev:host &> /tmp/fe-dev.log &)
		sleep 3
	fi

	if ! docker ps --format '{{.Names}}' | grep -q anno-bot-be-api; then
		echo "Starting backend Docker..."
		(cd "$BE_ROOT" && docker compose up -d api)
		sleep 5
	fi
}

start_ngrok() {
	pkill ngrok 2>/dev/null || true
	sleep 1

	echo "Starting ngrok tunnels..."
	local global_config="$HOME/.config/ngrok/ngrok.yml"
	local token=""
	if [[ -f "$global_config" ]]; then
		token=$(grep -E 'authtoken:' "$global_config" | awk '{print $2}')
	fi

	if [[ -n "$token" ]]; then
		ngrok start --all --config "$NGROK_CONFIG" --authtoken "$token" &> /tmp/ngrok.log &
	else
		ngrok start --all --config "$NGROK_CONFIG" &> /tmp/ngrok.log &
	fi
	NGROK_PID=$!

	for i in $(seq 1 30); do
		if curl -s http://127.0.0.1:4040/api/tunnels > /dev/null 2>&1; then
			break
		fi
		sleep 1
	done

	local tunnels
	tunnels=$(curl -s http://127.0.0.1:4040/api/tunnels)

	FE_URL=$(echo "$tunnels" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for t in data.get('tunnels', []):
    if t['name'] == 'anno-bot-fe':
        print(t['public_url'].rstrip('/'))
" 2>/dev/null || echo "")

	BE_URL=$(echo "$tunnels" | python3 -c "
import sys, json
data = json.load(sys.stdin)
for t in data.get('tunnels', []):
    if t['name'] == 'anno-bot-be':
        print(t['public_url'].rstrip('/'))
" 2>/dev/null || echo "")

	if [[ -z "$FE_URL" || -z "$BE_URL" ]]; then
		echo "Failed to get ngrok URLs. Check /tmp/ngrok.log"
		exit 1
	fi
}

upsert_env() {
	local file="$1" key="$2" value="$3"
	if grep -q "^$key=" "$file" 2>/dev/null; then
		sed -i "s|^$key=.*|$key=$value|" "$file"
	else
		echo "$key=$value" >> "$file"
	fi
}

update_env() {
	echo -e "${CYAN}Frontend:${NC} $FE_URL"
	echo -e "${CYAN}Backend: ${NC} $BE_URL"
	echo ""

	local fe_env="$ROOT/.env.local"
	local be_env="$BE_ROOT/.env.local"

	if [[ ! -f "$fe_env" ]]; then cp "$ROOT/.env" "$fe_env"; fi
	if [[ ! -f "$be_env" ]]; then cp "$BE_ROOT/.env" "$be_env"; fi

	upsert_env "$fe_env" "VITE_API_CORE_URL" "$BE_URL"
	upsert_env "$be_env" "FRONTEND_URL" "$FE_URL"

	local cors="[\"$FE_URL\",\"http://localhost:3000\"]"
	upsert_env "$be_env" "BACKEND_CORS_ORIGINS" "$cors"

	echo -e "${GREEN}Updated .env.local files.${NC}"
}

restart_backend() {
	echo "Restarting backend container..."
	docker restart anno-bot-be-api > /dev/null
	echo -e "${GREEN}Backend restarted.${NC}"
}

set_telegram_webhook() {
	local be_env="$BE_ROOT/.env.local"
	local bot_token
	bot_token=$(
		grep -E '^TELEGRAM_BOT_TOKEN=' "$be_env" 2>/dev/null ||
		grep -E '^TELEGRAM_BOT_TOKEN=' "$BE_ROOT/.env" 2>/dev/null
	)
	bot_token=$(echo "$bot_token" | cut -d= -f2-)
	if [[ -z "$bot_token" ]]; then
		echo -e "${YELLOW}Skipping webhook: TELEGRAM_BOT_TOKEN not set.${NC}"
		return
	fi

	local wh_url="$BE_URL/api/v1/telegram/webhook"
	local secret
	secret=$(
		grep -E '^TELEGRAM_WEBHOOK_SECRET_TOKEN=' "$be_env" 2>/dev/null ||
		grep -E '^TELEGRAM_WEBHOOK_SECRET_TOKEN=' "$BE_ROOT/.env" 2>/dev/null
	)
	secret=$(echo "$secret" | cut -d= -f2-)

	local body="{\"url\":\"$wh_url\",\"allowed_updates\":[\"message\",\"callback_query\"],\"drop_pending_updates\":true}"
	if [[ -n "$secret" ]]; then
		body="{\"url\":\"$wh_url\",\"allowed_updates\":[\"message\",\"callback_query\"],\"drop_pending_updates\":true,\"secret_token\":\"$secret\"}"
	fi

	curl -s -X POST "https://api.telegram.org/bot$bot_token/setWebhook" \
		-H "Content-Type: application/json" \
		-d "$body" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('Webhook:', 'OK' if d.get('ok') else 'FAILED - ' + d.get('description', ''))
"

	curl -s -X POST "https://api.telegram.org/bot$bot_token/setMyCommands" \
		-H "Content-Type: application/json" \
		-d '{"commands":[{"command":"start","description":"Welcome and web app link"},{"command":"dashboard","description":"Access dashboard"},{"command":"help","description":"Get help and instructions"}]}' \
		| python3 -c "
import sys, json
d = json.load(sys.stdin)
print('Commands:', 'OK' if d.get('ok') else 'FAILED')
"
}

# --- Main ---

echo -e "${CYAN}=== AnnoBot Tunnel Runner ===${NC}"
echo ""

ensure_services
start_ngrok
update_env
restart_backend
set_telegram_webhook

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}All tunnels are up!${NC}"
echo -e "${CYAN}Frontend:${NC} $FE_URL"
echo -e "${CYAN}Backend: ${NC} $BE_URL"
echo -e "${CYAN}Webhook: ${NC} $BE_URL/api/v1/telegram/webhook"
echo -e "${GREEN}================================${NC}"
echo ""
echo "Press Ctrl+C to stop tunnels."

wait $NGROK_PID
