#!/usr/bin/env bash

echo "🔄 Copying plugins.json from public to dist folder..."

# Ensure dist folder exists
mkdir -p /home/i/p/temp/module-federation-examples/dynamic-system-host/app1/dist

# Copy the plugins.json file
cp /home/i/p/temp/module-federation-examples/dynamic-system-host/app1/public/plugins.json \
   /home/i/p/temp/module-federation-examples/dynamic-system-host/app1/dist/plugins.json

echo "✅ plugins.json copied successfully!"
echo ""
echo "📋 Current plugin configuration:"
cat /home/i/p/temp/module-federation-examples/dynamic-system-host/app1/dist/plugins.json | jq '.plugins[] | "  - \(.name) (\(.scope)/\(.module))"'
