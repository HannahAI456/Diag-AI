# App AI Y Tế - Ứng dụng phân tích hình ảnh y tế

Ứng dụng React Native hỗ trợ phân tích hình ảnh y tế bằng AI với giao diện đa ngôn ngữ (Tiếng Việt/English).

## Cài đặt & Chạy

```bash
# Cài đặt packages
npm install

# Chạy trên iOS
npm run ios

# Chạy trên Android
npm run android
```

## Cấu trúc Components

### 1. **HomeScreen** (`src/app/Screens/Home/HomeScreen.js`)
Màn hình chính của ứng dụng, quản lý toàn bộ flow phân tích hình ảnh.

**State chính:**
- `selectedImage`: Hình ảnh được chọn để phân tích
- `language`: Ngôn ngữ hiện tại ('vi' hoặc 'en')
- `showImagePickerModal`: Hiển thị modal chọn ảnh
- `showHistoryModal`: Hiển thị modal lịch sử

**Chức năng:**
- Chọn ảnh từ camera hoặc thư viện
- Phân tích hình ảnh bằng AI
- Lưu và xem lịch sử phân tích
- Chuyển đổi ngôn ngữ

### 2. **Custom Hooks**

#### `useImagePicker` (`hooks/useImagePicker.js`)
Xử lý chọn ảnh từ camera/gallery.
```javascript
const {openCamera, openGallery} = useImagePicker();
```

#### `useImageAnalysis` (`hooks/useImageAnalysis.js`)
Xử lý phân tích hình ảnh với API.
```javascript
const {analyzing, analysisResult, analyzeImage, resetAnalysis} = useImageAnalysis();

// Gọi phân tích với ngôn ngữ
analyzeImage(imageData, onSuccess, language);
```

**Tham số `language`:** Truyền 'vi' hoặc 'en' để nhận kết quả theo ngôn ngữ tương ứng.

#### `useHistory` (`hooks/useHistory.js`)
Quản lý lịch sử phân tích.
```javascript
const {history, addToHistory, clearHistory, deleteHistoryItem} = useHistory();
```

### 3. **UI Components**

#### `HomeHeader`
Header với nút lịch sử, thông báo và chuyển ngôn ngữ.

#### `HeroSection`
Màn hình ban đầu với các nút chọn ảnh và kết quả gần đây.

#### `ImagePreview`
Xem trước hình ảnh đã chọn trước khi phân tích.
```javascript
<ImagePreview 
  imageUri={image.uri}
  onCancel={() => {}}
  onAnalyze={handleAnalyze}
  onImagePress={() => {}}
/>
```

#### `AnalysisResult`
Hiển thị kết quả phân tích với đa ngôn ngữ.
```javascript
<AnalysisResult 
  imageUri={image.uri}
  result={analysisResult}
  onReset={() => {}}
  onShare={() => {}}
  language={language} // 'vi' hoặc 'en'
/>
```

**Props:**
- `language`: Quyết định ngôn ngữ hiển thị các label và nút

#### `ImagePickerModal`
Modal chọn nguồn ảnh (camera/gallery).

#### `HistoryModal`
Modal hiển thị lịch sử các lần phân tích.

## Tích hợp API

Trong file `hooks/useImageAnalysis.js`:

```javascript
// 1. Tạo FormData
const formData = new FormData();
formData.append('image', {
  uri: imageData.uri,
  type: imageData.type,
  name: imageData.name,
});
formData.append('language', language); // Thêm ngôn ngữ

// 2. Gọi API
const response = await axios.post('YOUR_API_URL', formData);

// 3. Xử lý kết quả
const result = response.data;
setAnalysisResult(result);
```

**Format kết quả API:**
```javascript
{
  diagnosis: 'Tên bệnh',
  confidence: 85,
  description: 'Mô tả chi tiết',
  recommendations: ['Khuyến nghị 1', 'Khuyến nghị 2']
}
```

## Đa ngôn ngữ

App hỗ trợ 2 ngôn ngữ: Tiếng Việt (vi) và English (en).

**Cách thêm ngôn ngữ mới:**

1. Cập nhật `translations` object trong component
2. Thêm key ngôn ngữ vào state `language`
3. API cần trả về dữ liệu theo ngôn ngữ tương ứng

## Ghi chú

- Mock data đang được sử dụng trong `useImageAnalysis.js`
- Xóa mock data và bỏ comment API code khi tích hợp API thật
- Lịch sử được lưu trong AsyncStorage
- Hỗ trợ xem ảnh toàn màn hình với ImageViewer
