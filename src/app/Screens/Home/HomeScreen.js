import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from './styles';
import {RootNavigation} from '../../Common/RootNavigation';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid} from 'react-native';
import {AppColors} from '../../Common/AppColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from '../../Components/ImageViewer';

const {width, height} = Dimensions.get('window');
const HISTORY_STORAGE_KEY = '@skincheck_history';

const HomeScreen = () => {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [showImagePickerModal, setShowImagePickerModal] = React.useState(false);
  const [showPreviewModal, setShowPreviewModal] = React.useState(false);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState(null);
  const [history, setHistory] = React.useState([]);
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [imageViewerVisible, setImageViewerVisible] = React.useState(false);
  const [viewerImages, setViewerImages] = React.useState([]);
  const [viewerIndex, setViewerIndex] = React.useState(0);

  // Load history on mount
  React.useEffect(() => {
    loadHistory();
  }, []);

  // Load history from storage
  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  // Save history to storage
  const saveHistory = async (newHistory) => {
    try {
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  // Add to history
  const addToHistory = async (imageData, result) => {
    const historyItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      image: imageData,
      result: result,
    };
    const newHistory = [historyItem, ...history];
    await saveHistory(newHistory);
  };

  // Clear all history
  const clearHistory = () => {
    Alert.alert(
      'Xóa lịch sử',
      'Bạn có chắc chắn muốn xóa toàn bộ lịch sử?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await saveHistory([]);
            Alert.alert('Thành công', 'Đã xóa toàn bộ lịch sử');
          },
        },
      ],
    );
  };

  // Delete single history item
  const deleteHistoryItem = (id) => {
    Alert.alert(
      'Xóa mục này',
      'Bạn có chắc chắn muốn xóa mục này?',
      [
        {text: 'Hủy', style: 'cancel'},
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            const newHistory = history.filter(item => item.id !== id);
            await saveHistory(newHistory);
          },
        },
      ],
    );
  };

  // View history item
  const viewHistoryItem = (item) => {
    setSelectedImage(item.image);
    setAnalysisResult(item.result);
    setShowHistoryModal(false);
  };

  // Open image viewer
  const openImageViewer = (imageUri, index = 0) => {
    setViewerImages([{uri: imageUri}]);
    setViewerIndex(index);
    setImageViewerVisible(true);
  };

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Quyền truy cập Camera',
            message: 'Ứng dụng cần quyền truy cập camera để chụp ảnh',
            buttonNeutral: 'Hỏi lại sau',
            buttonNegative: 'Hủy',
            buttonPositive: 'Đồng ý',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const handleTakePhoto = async () => {
    setShowImagePickerModal(false);
    await new Promise(resolve => setTimeout(resolve, 300));

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Không có quyền truy cập',
        'Vui lòng cấp quyền camera trong cài đặt',
      );
      return;
    }

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 2000,
      maxHeight: 2000,
      includeBase64: false,
      saveToPhotos: false,
      cameraType: 'back',
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera Error: ', response.errorMessage);
        Alert.alert('Lỗi', 'Không thể mở camera');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const imageData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
        };
        setSelectedImage(imageData);
        setShowPreviewModal(true);
      }
    });
  };

  const handlePickFromLibrary = async () => {
    setShowImagePickerModal(false);

    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 2000,
      maxHeight: 2000,
      selectionLimit: 1,
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const imageData = {
          uri: asset.uri,
          type: asset.type || 'image/jpeg',
          name: asset.fileName || `photo_${Date.now()}.jpg`,
        };
        setSelectedImage(imageData);
        setShowPreviewModal(true);
      }
    });
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setAnalyzing(true);
    setShowPreviewModal(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResult = {
        diagnosis: 'Viêm da tiếp xúc',
        confidence: 85,
        description:
          'Có dấu hiệu viêm da tiếp xúc nhẹ. Khuyến nghị gặp bác sĩ da liễu để được tư vấn cụ thể.',
        recommendations: [
          'Tránh tiếp xúc với các chất gây kích ứng',
          'Giữ da sạch và khô ráo',
          'Sử dụng kem dưỡng ẩm phù hợp',
          'Gặp bác sĩ nếu triệu chứng không cải thiện',
        ],
      };

      setAnalysisResult(mockResult);
      // Save to history
      await addToHistory(selectedImage, mockResult);
    } catch (error) {
      console.error('Analysis error:', error);
      Alert.alert('Lỗi', 'Không thể phân tích hình ảnh. Vui lòng thử lại.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setShowImagePickerModal(true);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header App Fixed */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Icon name="hospital-box" size={28} color={AppColors.MainColor} />
          <Text style={styles.headerTitle}>SkinCheck AI</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.btnHeader, {marginRight: 8}]}
            onPress={() => setShowHistoryModal(true)}>
            <Icon name="history" size={24} color="gray" />
            {history.length > 0 && (
              <View style={styles.historyBadge}>
                <Text style={styles.historyBadgeText}>{history.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnHeader}
            onPress={() => RootNavigation.navigate('Notification')}>
            <Icon name="bell" size={24} color="gray" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Medical Banner */}
      <View
        style={[
          styles.medicalBannerContainer,
          {
            backgroundColor: '#1565C0',
            paddingVertical: 16,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          },
        ]}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="heart-pulse" size={28} color="#fff" />
        </View>
        <View style={{flex: 1}}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#fff',
              marginBottom: 2,
            }}>
            Kiểm tra sức khỏe da
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: 'rgba(255, 255, 255, 0.9)',
            }}>
            Phát hiện sớm, chăm sóc tốt
          </Text>
        </View>
        <Icon name="chevron-right" size={24} color="rgba(255, 255, 255, 0.7)" />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Icon
            name="microscope"
            size={80}
            color={AppColors.MainColor}
            style={styles.heroIcon}
          />
          <Text style={styles.heroTitle}>Kiểm tra sức khỏe da</Text>
          <Text style={styles.heroSubtitle}>
            Chụp hoặc tải ảnh lên để phân tích tình trạng da bằng AI
          </Text>
        </View>

        {/* Image Analysis Section */}
        {!selectedImage && !analysisResult && (
          <View style={styles.analysisSection}>
            <TouchableOpacity
              style={styles.mainActionButton}
              onPress={() => setShowImagePickerModal(true)}>
              <Icon name="camera-plus" size={40} color="#fff" />
              <Text style={styles.mainActionButtonText}>Bắt đầu kiểm tra</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Image Preview */}
        {selectedImage && !analysisResult && (
          <View style={styles.previewSection}>
            <TouchableOpacity onPress={() => openImageViewer(selectedImage.uri)}>
              <Image
                source={{uri: selectedImage.uri}}
                style={styles.previewImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <View style={styles.previewActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setSelectedImage(null)}>
                <Icon name="close" size={20} color="#666" />
                <Text style={styles.secondaryButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleAnalyzeImage}>
                <Icon name="brain" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Phân tích</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Analysis Loading */}
        {analyzing && (
          <View style={styles.loadingSection}>
            <ActivityIndicator size="large" color={AppColors.MainColor} />
            <Text style={styles.loadingText}>Đang phân tích hình ảnh...</Text>
            <Text style={styles.loadingSubtext}>
              Vui lòng đợi trong giây lát
            </Text>
          </View>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <View style={styles.resultSection}>
            <View style={styles.resultCard}>
              <View style={styles.resultImageContainer}>
                <TouchableOpacity onPress={() => openImageViewer(selectedImage.uri)}>
                  <Image
                    source={{uri: selectedImage.uri}}
                    style={styles.resultImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.diagnosisContainer}>
                <Text style={styles.diagnosisLabel}>Chẩn đoán:</Text>
                <Text style={styles.diagnosisText}>
                  {analysisResult.diagnosis}
                </Text>
                <View style={styles.confidenceContainer}>
                  <Text style={styles.confidenceLabel}>Độ tin cậy:</Text>
                  <Text style={styles.confidenceValue}>
                    {analysisResult.confidence}%
                  </Text>
                </View>
              </View>

              <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionLabel}>Mô tả:</Text>
                <Text style={styles.descriptionText}>
                  {analysisResult.description}
                </Text>
              </View>

              <View style={styles.recommendationsContainer}>
                <Text style={styles.recommendationsLabel}>Khuyến nghị:</Text>
                {analysisResult.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <Icon name="check" size={18} color={AppColors.MainColor} />
                    <Text style={styles.recommendationText}>{rec}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.resultActions}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleReset}>
                <Icon name="refresh" size={20} color="#666" />
                <Text style={styles.secondaryButtonText}>Kiểm tra mới</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButton}>
                <Icon name="share-variant" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Chia sẻ</Text>
              </TouchableOpacity>
            </View>

            {/* Disclaimer */}
            <View style={styles.disclaimerContainer}>
              <Icon name="information" size={20} color="#FF9800" />
              <Text style={styles.disclaimerText}>
                Kết quả chỉ mang tính chất tham khảo. Vui lòng gặp bác sĩ để
                được tư vấn chính xác.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modal chọn nguồn hình ảnh */}
      <Modal
        visible={showImagePickerModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImagePickerModal(false)}>
        <View style={styles.imagePickerModalContainer}>
          <TouchableOpacity
            style={styles.imagePickerModalOverlay}
            activeOpacity={1}
            onPress={() => setShowImagePickerModal(false)}
          />
          <View style={styles.imagePickerModalContent}>
            <View style={styles.imagePickerModalHeader}>
              <Text style={styles.imagePickerModalTitle}>Chọn hình ảnh</Text>
              <TouchableOpacity
                onPress={() => setShowImagePickerModal(false)}
                style={styles.imagePickerModalCloseButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={handleTakePhoto}>
              <View
                style={[
                  styles.imagePickerOptionIcon,
                  {backgroundColor: '#E3F2FD'},
                ]}>
                <Icon name="camera" size={28} color="#2196F3" />
              </View>
              <View style={styles.imagePickerOptionContent}>
                <Text style={styles.imagePickerOptionTitle}>Chụp ảnh</Text>
                <Text style={styles.imagePickerOptionDescription}>
                  Mở camera để chụp ảnh mới
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.imagePickerOption}
              onPress={handlePickFromLibrary}>
              <View
                style={[
                  styles.imagePickerOptionIcon,
                  {backgroundColor: '#F3E5F5'},
                ]}>
                <Icon name="image-multiple" size={28} color="#9C27B0" />
              </View>
              <View style={styles.imagePickerOptionContent}>
                <Text style={styles.imagePickerOptionTitle}>
                  Chọn từ thư viện
                </Text>
                <Text style={styles.imagePickerOptionDescription}>
                  Chọn ảnh có sẵn từ thư viện
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal lịch sử */}
      <Modal
        visible={showHistoryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistoryModal(false)}>
        <View style={styles.historyModalContainer}>
          <TouchableOpacity
            style={styles.historyModalOverlay}
            activeOpacity={1}
            onPress={() => setShowHistoryModal(false)}
          />
          <View style={styles.historyModalContent}>
            <View style={styles.historyModalHeader}>
              <Text style={styles.historyModalTitle}>Lịch sử kiểm tra</Text>
              <View style={{flexDirection: 'row', gap: 8}}>
                {history.length > 0 && (
                  <TouchableOpacity
                    onPress={clearHistory}
                    style={styles.clearHistoryButton}>
                    <Icon name="delete" size={20} color="#f44336" />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => setShowHistoryModal(false)}
                  style={styles.historyModalCloseButton}>
                  <Icon name="close" size={24} color="#666" />
                </TouchableOpacity>
              </View>
            </View>

            {history.length === 0 ? (
              <View style={styles.emptyHistoryContainer}>
                <Icon name="history" size={64} color="#ccc" />
                <Text style={styles.emptyHistoryText}>
                  Chưa có lịch sử kiểm tra
                </Text>
                <Text style={styles.emptyHistorySubtext}>
                  Các kết quả phân tích sẽ được lưu tại đây
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.historyList}
                showsVerticalScrollIndicator={false}>
                {history.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyItem}
                    onPress={() => viewHistoryItem(item)}>
                    <TouchableOpacity onPress={(e) => {
                      e.stopPropagation();
                      openImageViewer(item.image.uri);
                    }}>
                      <Image
                        source={{uri: item.image.uri}}
                        style={styles.historyItemImage}
                      />
                    </TouchableOpacity>
                    <View style={styles.historyItemContent}>
                      <Text style={styles.historyItemDiagnosis}>
                        {item.result.diagnosis}
                      </Text>
                      <Text style={styles.historyItemDate}>
                        {new Date(item.timestamp).toLocaleString('vi-VN', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      <View style={styles.historyItemConfidence}>
                        <Icon name="check-circle" size={14} color="#4CAF50" />
                        <Text style={styles.historyItemConfidenceText}>
                          {item.result.confidence}% độ tin cậy
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteHistoryItemButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem(item.id);
                      }}>
                      <Icon name="close-circle" size={24} color="#f44336" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Image Viewer */}
      <ImageViewer
        visible={imageViewerVisible}
        images={viewerImages}
        index={viewerIndex}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
