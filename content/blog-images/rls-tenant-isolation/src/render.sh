#!/bin/sh
# usage: render.sh <name> <width> <height>  -> <name>.png (2x) and <name>.webp (1x target width)
set -e
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
DIR="$(cygpath -w "$PWD")"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size="$2,$3" --virtual-time-budget=8000 \
  --screenshot="$DIR\\$1.png" "file:///$(cygpath -m "$PWD")/$1.html" >/dev/null 2>&1
node -e "
const sharp=require('sharp');
sharp('$1.png').resize($2,$3).webp({quality:86,effort:6}).toFile('$1.webp').then(i=>console.log('$1.webp',i.width+'x'+i.height,(i.size/1024).toFixed(1)+' KB'));
"
