#!/usr/bin/bash
set -e
sum1=`sha256sum characters.json`
deno run --allow-net --allow-write --allow-read extract.ts
sum2=`sha256sum characters.json`
if [[ $sum1 != $sum2 ]]; then
  git add characters.json
  dn=`date -u +%F`
  git commit -m "Characters updated $dn" 
  git push
fi

