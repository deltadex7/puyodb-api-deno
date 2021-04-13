#!/usr/bin/bash

sum1=`sha256sum characters.json`
deno run --allow-net --allow-write extract.ts
sum2=`sha256sum characters.json`
if [ $sum1 != $sum2 ]; then
  git add characters.json
  git commit -m "Characters updated $(date -u +%F)" 
  git push
fi

