#!/bin/sh
# usage: render-diagram.sh <name>  -> 960 CSS px wide, rendered at 2x, trimmed to content, saved at 1440px wide WebP
set -e
cd "$(dirname "$0")"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
DIR="$(cygpath -w "$PWD")"
"$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
  --window-size=960,1900 --virtual-time-budget=8000 \
  --screenshot="$DIR\\$1.png" "file:///$(cygpath -m "$PWD")/$1.html" >/dev/null 2>&1
node -e "
const sharp=require('sharp');
(async()=>{
  const bg={r:11,g:18,b:32,alpha:1};
  const t=await sharp('$1.png').trim({background:'#0b1220',threshold:4}).toBuffer();
  const padded=await sharp(t).extend({top:88,bottom:96,left:96,right:96,background:bg}).toBuffer();
  const i=await sharp(padded).resize({width:1440}).webp({quality:84,effort:6}).toFile('$1.webp');
  console.log('$1.webp',i.width+'x'+i.height,(i.size/1024).toFixed(1)+' KB');
})();
"
