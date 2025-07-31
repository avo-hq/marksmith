#!/bin/bash

set -e

yarn build
gem build -o marksmith.gem
gem push ./marksmith.gem
rm marksmith.gem
