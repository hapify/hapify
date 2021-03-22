#!/usr/bin/env bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null && pwd)"
DIST_DIR="${DIR}/dist"

# Build main language
cd "${DIR}/en" || exit 1
mkdocs build --clean --site-dir "${DIST_DIR}"

# Build other languages
cd "${DIR}/fr" || exit 1
mkdocs build --dirty --site-dir "${DIST_DIR}/fr"

# Deploy on github pages
cd "${DIR}" || exit 1
ghp-import \
  --cname docs.hapify.io \
  --remote pages \
  --branch master \
  --push \
  "${DIST_DIR}"
