#!/usr/bin/env bash

set -e

NODE_MODULES_PATH="${PWD}/node_modules"
SRC_PATH="${PWD}/packages/gui/src"

# Copy ACE Modes
if [ -d "$NODE_MODULES_PATH/ace-builds/src-min-noconflict" ]; then
  rm -rf "$SRC_PATH/assets/ace-builds/src-min-noconflict"
  cp -r "$NODE_MODULES_PATH/ace-builds/src-min-noconflict" "$SRC_PATH/assets/ace-builds/src-min-noconflict"
  cp "$SRC_PATH/assets/ace-builds/mode-hpf.js" "$SRC_PATH/assets/ace-builds/src-min-noconflict"
fi



