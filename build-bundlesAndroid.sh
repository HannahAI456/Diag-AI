#!/bin/bash

set -e

# === CONFIG ===
ACCESS_TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzc2MTc4Mjk5LCJleHAiOjE3Nzg3NzAyOTl9.HNf2EejfG-r-9JrsIGwu5-CrWk2hROiyYbsDf8jOVco"
UPLOAD_URL="https://ota-update.csctech.vn/upload"
PUBLISH_URL="https://ota-update.csctech.vn/content-manager/collection-types/api::android.android/uge6c68atudz2hdh9ibpsi9h/actions/publish"
NOTE="Diag AI"

# === PROMPT VERSION ===
read -p "🔢 Nhập version cho Android (ví dụ: 1.0.1): " TARGET_VERSION

# === BUILD ===
echo "🔧 Bundling Android..."

mkdir -p android/output
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/output/index.android.bundle \
  --assets-dest android/output \
  --sourcemap-output android/sourcemap.js

cd android
find output -type f | zip index.android.bundle.zip -@
cd ..

rm -rf android/output android/sourcemap.js

# === UPLOAD ===
echo "📡 Uploading Android bundle to Strapi..."

UPLOAD_RESPONSE=$(curl -s -X POST "$UPLOAD_URL" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -F "files=@android/index.android.bundle.zip" \
  -F "fileInfo={\"name\":\"index.android.bundle.zip\",\"folder\":null}")

echo "📄 UPLOAD_RESPONSE: $UPLOAD_RESPONSE"

DOCUMENT_ID=$(echo "$UPLOAD_RESPONSE" | jq -r 'if type == "array" then .[0].documentId else empty end')
FILE_ID=$(echo "$UPLOAD_RESPONSE" | jq -r 'if type == "array" then .[0].id else empty end')

if [ -z "$DOCUMENT_ID" ] || [ -z "$FILE_ID" ]; then
  echo "❌ Không thể lấy ID từ phản hồi upload. Dừng lại."
  exit 1
fi

echo "✅ Uploaded. File ID: $FILE_ID, Document ID: $DOCUMENT_ID"

# === PUBLISH ===
echo "🚀 Publishing Android version $TARGET_VERSION..."

curl -s -X POST "$PUBLISH_URL" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"note\": \"$NOTE\",
    \"targetVersion\": \"$TARGET_VERSION\",
    \"enable\": true,
    \"required\": true,
    \"bundle\": [{
      \"id\": $FILE_ID,
      \"documentId\": \"$DOCUMENT_ID\",
      \"name\": \"index.android.bundle.zip\"
    }]
  }" > /dev/null

echo "🎉 Android OTA upload & publish complete (version $TARGET_VERSION)!"
