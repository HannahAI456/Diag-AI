#!/bin/bash

set -e

# === CONFIG ===
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MTc4MTA4LCJleHAiOjE3Nzg3NzAxMDh9.r-YKQgsxOAhOlFdskUMYy_M7oemhZUzZ0ppqTSHX5Pw"
UPLOAD_URL="https://ota-update.csctech.vn/upload"
PUBLISH_URL="https://ota-update.csctech.vn/content-manager/collection-types/api::ios-ipad.ios-ipad/ylp20xhyls967zu5im0oegbk/actions/publish"
NOTE="Diag AI"

read -p "Nhập version (vd: 1.0.1): " VERSION

# === BUILD ===
echo "📦 Bundling iOS..."

mkdir -p ios/output
npx react-native bundle \
  --platform ios \
  --dev false \
  --entry-file index.js \
  --bundle-output ios/output/main.jsbundle \
  --assets-dest ios/output \
  --sourcemap-output ios/sourcemap.js

cd ios
find output -type f | zip main.jsbundle.zip -@
zip sourcemap.zip sourcemap.js
cd ..

rm -rf ios/output ios/sourcemap.js

# === UPLOAD ===
echo "📡 Uploading iOS bundle..."

UPLOAD_RESPONSE=$(curl -s -X POST "$UPLOAD_URL" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "files=@ios/main.jsbundle.zip" \
  -F "fileInfo={\"name\":\"main.jsbundle.zip\",\"folder\":null}")

echo "📄 Upload response: $UPLOAD_RESPONSE"

DOCUMENT_ID=$(echo "$UPLOAD_RESPONSE" | jq -r 'if type == "array" then .[0].documentId else empty end')
FILE_ID=$(echo "$UPLOAD_RESPONSE" | jq -r 'if type == "array" then .[0].id else empty end')

if [ -z "$DOCUMENT_ID" ] || [ -z "$FILE_ID" ]; then
  echo "❌ Failed to parse upload response. Exiting..."
  exit 1
fi

echo "✅ Uploaded. File ID: $FILE_ID, Document ID: $DOCUMENT_ID"

# === PUBLISH ===
echo "🚀 Publishing iOS version..."

curl -s -X POST "$PUBLISH_URL" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"note\": \"$NOTE\",
    \"targetVersion\": \"$VERSION\",
    \"enable\": true,
    \"required\": true,
    \"bundle\": [{
      \"id\": $FILE_ID,
      \"documentId\": \"$DOCUMENT_ID\",
      \"name\": \"main.jsbundle.zip\"
    }]
  }" > /dev/null

echo "🎉 iOS OTA upload & publish complete!"
