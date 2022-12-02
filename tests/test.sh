#! /bin/bash

tests_dir=$(dirname -- "$0")

for i in $(seq 1 3); do
  (
    cd "$tests_dir/$i/" || exit 1
    bash ./run.sh
  )
done
