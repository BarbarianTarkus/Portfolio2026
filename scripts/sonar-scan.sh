#!/usr/bin/env bash
# Run a SonarQube analysis locally without installing anything permanent.
#
# It uses, in order of preference:
#   1. a previously downloaded SonarScanner CLI in the user cache
#   2. Java 17+ (downloads the 10 MB scanner CLI once, pinned version)
#   3. Docker (if the daemon is running)
#
# Credentials are read from .env (git-ignored):
#   SONAR_HOST_URL=https://sonarqube.verduguez.com
#   SONARQUBE_API_KEY=...      # or SONAR_TOKEN
#
#   ./scripts/sonar-scan.sh
#   ./scripts/sonar-scan.sh -Dsonar.verbose=true
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

HOST="${SONAR_HOST_URL:-https://sonarqube.verduguez.com}"
TOKEN="${SONAR_TOKEN:-${SONARQUBE_API_KEY:-}}"

if [[ -z "$TOKEN" ]]; then
  echo "error: no token found. Set SONAR_TOKEN (or SONARQUBE_API_KEY) in .env." >&2
  exit 1
fi

# The scanner CLI reads these environment variables directly.
export SONAR_TOKEN="$TOKEN"
export SONAR_HOST_URL="$HOST"

SCANNER_VERSION="${SONAR_SCANNER_VERSION:-8.2.0.6438}"
SCANNER_ROOT="${XDG_CACHE_HOME:-$HOME/.cache}/sonar-scanner-cli"
SCANNER_BIN="$SCANNER_ROOT/sonar-scanner-$SCANNER_VERSION/bin/sonar-scanner"
SCANNER_URL="https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-$SCANNER_VERSION.zip"

have_java() {
  command -v java >/dev/null 2>&1 || return 1
  local major
  major="$(java -version 2>&1 | sed -n 's/.*version "\([0-9][0-9]*\).*/\1/p' | head -n1)"
  [[ -n "$major" && "$major" -ge 17 ]]
}

run_with_docker() {
  exec docker run --rm \
    --user "$(id -u):$(id -g)" \
    -e HOME=/tmp \
    -e SONAR_HOST_URL="$HOST" \
    -e SONAR_TOKEN="$TOKEN" \
    -v "$PWD:/usr/src" \
    sonarsource/sonar-scanner-cli:12.3 "$@"
}

if [[ -x "$SCANNER_BIN" ]] && have_java; then
  exec "$SCANNER_BIN" "$@"
fi

if have_java && command -v curl >/dev/null 2>&1 && command -v unzip >/dev/null 2>&1; then
  echo "Fetching SonarScanner CLI $SCANNER_VERSION (one-time)..." >&2
  mkdir -p "$SCANNER_ROOT"
  tmp="$(mktemp -d)"
  trap 'rm -rf "$tmp"' EXIT
  curl -fsSL --retry 2 -o "$tmp/scanner.zip" "$SCANNER_URL"
  unzip -q "$tmp/scanner.zip" -d "$SCANNER_ROOT"
  rm -rf "$tmp"
  trap - EXIT
  exec "$SCANNER_BIN" "$@"
fi

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  run_with_docker "$@"
fi

echo "error: need Java 17+ (with curl/unzip) or a running Docker daemon to scan." >&2
exit 1
