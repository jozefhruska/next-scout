#! /bin/bash

test_num="$(basename "$(pwd)")"

echo "--------------- Test #${test_num} ---------------"
(
  echo "Scenario: Both \"./app\" and \"./pages\" directories do exist, trailing slash enabled"
  printf "\n"
)

cd ./in/
../../../dist/index.js --output ../out/routeBuilder.ts --trailing-slash
diff ../out/routeBuilder.expected.ts ../out/routeBuilder.ts
