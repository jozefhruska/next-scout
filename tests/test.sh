#! /bin/bash

for i in $(seq 1 5); do
  cd "./$i/" || exit 1
  bash ./run.sh
done
