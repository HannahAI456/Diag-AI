#!/bin/bash

# OTA Update Testing Script
# Chạy script này để verify OTA update đã hoạt động đúng

echo "🔍 OTA Update Verification Script"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if react-native-ota-hot-update is installed
echo "1️⃣  Checking react-native-ota-hot-update installation..."
if grep -q "react-native-ota-hot-update" package.json; then
    echo -e "${GREEN}✅ react-native-ota-hot-update found in package.json${NC}"
    VERSION=$(grep "react-native-ota-hot-update" package.json | grep -o '"[0-9.]*"' | tr -d '"')
    echo "   Version: $VERSION"
else
    echo -e "${RED}❌ react-native-ota-hot-update NOT found${NC}"
    exit 1
fi
echo ""

# Check Android setup
echo "2️⃣  Checking Android configuration..."
if [ -f "android/app/src/main/java/com/dulichcamau/MainApplication.java" ]; then
    if grep -q "OtaHotUpdate" android/app/src/main/java/com/dulichcamau/MainApplication.java; then
        echo -e "${GREEN}✅ Android MainApplication.java configured${NC}"
    else
        echo -e "${RED}❌ OtaHotUpdate not imported in MainApplication.java${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  MainApplication.java not found${NC}"
fi
echo ""

# Check iOS setup
echo "3️⃣  Checking iOS configuration..."
if [ -f "ios/CloneProject/AppDelegate.mm" ]; then
    if grep -q "OtaHotUpdate" ios/CloneProject/AppDelegate.mm; then
        echo -e "${GREEN}✅ iOS AppDelegate.mm configured${NC}"
    else
        echo -e "${RED}❌ OtaHotUpdate not imported in AppDelegate.mm${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  AppDelegate.mm not found${NC}"
fi
echo ""

# Check useUpdateVersionApp hook
echo "4️⃣  Checking useUpdateVersionApp hook..."
if [ -f "src/app/Hooks/useUpdateVersionApp.js" ]; then
    if grep -q "const \[error, setError\] = useState(null);" src/app/Hooks/useUpdateVersionApp.js; then
        echo -e "${GREEN}✅ Error state added${NC}"
    else
        echo -e "${RED}❌ Error state missing${NC}"
    fi
    
    if grep -q "const \[isDownloading, setIsDownloading\] = useState(false);" src/app/Hooks/useUpdateVersionApp.js; then
        echo -e "${GREEN}✅ isDownloading state added${NC}"
    else
        echo -e "${RED}❌ isDownloading state missing${NC}"
    fi
    
    if grep -q "restartAfterInstall: false" src/app/Hooks/useUpdateVersionApp.js; then
        echo -e "${GREEN}✅ restartAfterInstall set to false${NC}"
    else
        echo -e "${YELLOW}⚠️  restartAfterInstall might still be true${NC}"
    fi
else
    echo -e "${RED}❌ useUpdateVersionApp.js not found${NC}"
fi
echo ""

# Check App.js
echo "5️⃣  Checking App.js..."
if [ -f "App.js" ]; then
    if grep -q "hasStartedRequiredUpdate" App.js; then
        echo -e "${GREEN}✅ hasStartedRequiredUpdate flag added${NC}"
    else
        echo -e "${RED}❌ hasStartedRequiredUpdate flag missing${NC}"
    fi
    
    if grep -q "error," App.js; then
        echo -e "${GREEN}✅ error prop passed to UpdateModal${NC}"
    else
        echo -e "${RED}❌ error prop not passed${NC}"
    fi
else
    echo -e "${RED}❌ App.js not found${NC}"
fi
echo ""

echo "=================================="
echo "✨ Verification Complete!"
echo ""
echo "📝 Next Steps:"
echo "   1. Run: npm install (nếu chưa chạy)"
echo "   2. Clean build:"
echo "      - Android: cd android && ./gradlew clean && cd .."
echo "      - iOS: cd ios && pod install && cd .."
echo "   3. Test trên device/emulator"
echo ""
echo "🧪 Test Scenarios:"
echo "   [ ] Optional update - click 'Để sau'"
echo "   [ ] Optional update - click 'Cập nhật ngay'"
echo "   [ ] Required update - auto download"
echo "   [ ] Network error during download"
echo "   [ ] Spam click update button"
echo "   [ ] App restart after successful update"
echo ""
