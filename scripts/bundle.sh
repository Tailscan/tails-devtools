#!/bin/bash
set -ex

pushd chrome
zip -r ../chrome-tails-devtools.zip .
popd

pushd firefox
zip -r ../firefox-tails-devtools.zip .
popd