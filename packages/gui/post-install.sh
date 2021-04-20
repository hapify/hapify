#!/usr/bin/env bash

set -e

# Copy ACE Modes
if [ -d "$PWD/node_modules/ace-builds/src-min-noconflict" ]; then
  rm -rf "$PWD/src/assets/ace-builds/src-min-noconflict"
  cp -r "$PWD/node_modules/ace-builds/src-min-noconflict" "$PWD/src/assets/ace-builds/src-min-noconflict"
  cp "$PWD/src/assets/ace-builds/mode-hpf.js" "$PWD/src/assets/ace-builds/src-min-noconflict"
fi



