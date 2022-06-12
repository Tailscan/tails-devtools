#!/bin/bash
set -ex

pushd dist
zip -r ../tails-devtools.zip .
popd