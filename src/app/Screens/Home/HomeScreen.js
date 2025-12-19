import {StatusBar, ScrollView, View} from 'react-native';
import React from 'react';
import {
  SafeAreaView,
  useSafeArea,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {styles} from './styles';
import {RootNavigation} from '../../Common/RootNavigation';
import ImageViewer from '../../Components/ImageViewer';

// Hooks
import {useHistory} from './hooks/useHistory';
import {useImagePicker} from './hooks/useImagePicker';
import {useImageAnalysis} from './hooks/useImageAnalysis';

// Components
import {HomeHeader} from './components/HomeHeader';
import {MedicalBanner} from './components/MedicalBanner';
import {HeroSection} from './components/HeroSection';
import {ImagePreview} from './components/ImagePreview';
import {AnalysisLoading} from './components/AnalysisLoading';
import {AnalysisResult} from './components/AnalysisResult';
import {ImagePickerModal} from './components/ImagePickerModal';
import {HistoryModal} from './components/HistoryModal';
import {BottomNavigation} from './components/BottomNavigation';

const HomeScreen = () => {
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [showImagePickerModal, setShowImagePickerModal] = React.useState(false);
  const [showHistoryModal, setShowHistoryModal] = React.useState(false);
  const [imageViewerVisible, setImageViewerVisible] = React.useState(false);
  const [viewerImages, setViewerImages] = React.useState([]);
  const [activeTab, setActiveTab] = React.useState('home');
  const [language, setLanguage] = React.useState('vi');

  // Custom hooks
  const {history, addToHistory, clearHistory, deleteHistoryItem} = useHistory();
  const {openCamera, openGallery} = useImagePicker();
  const {analyzing, analysisResult, analyzeImage, resetAnalysis} =
    useImageAnalysis();

  // Open image viewer
  const openImageViewer = imageUri => {
    setViewerImages([{uri: imageUri}]);
    setImageViewerVisible(true);
  };

  // Handle camera
  const handleCamera = async () => {
    setShowImagePickerModal(false);
    await new Promise(resolve => setTimeout(resolve, 600));

    const image = await openCamera();
    if (image) {
      setSelectedImage(image);
      // Auto analyze after selecting image
      await analyzeImage(
        image,
        async result => {
          await addToHistory(image, result);
        },
        language,
      );
    }
  };

  // Handle gallery
  const handleGallery = async () => {
    setShowImagePickerModal(false);
    await new Promise(resolve => setTimeout(resolve, 600));

    const image = await openGallery();
    if (image) {
      setSelectedImage(image);
      // Auto analyze after selecting image
      await analyzeImage(
        image,
        async result => {
          await addToHistory(image, result);
        },
        language,
      );
    }
  };

  // Handle analyze
  const handleAnalyze = async () => {
    await analyzeImage(
      selectedImage,
      async result => {
        await addToHistory(selectedImage, result);
      },
      language,
    );
  };

  // Handle reset
  const handleReset = () => {
    setSelectedImage(null);
    resetAnalysis();
    setShowImagePickerModal(true);
  };

  // View history item
  const viewHistoryItem = item => {
    setSelectedImage(item.image);
    analyzeImage(
      item.image,
      () => {
        // Just display the result, don't save again
      },
      language,
    );
    setShowHistoryModal(false);
  };

  // Change language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    
    // Re-translate current result if exists
    if (analysisResult && selectedImage) {
      analyzeImage(
        selectedImage,
        () => {
          // Just re-translate, don't save to history again
        },
        newLanguage,
      );
    }
  };  return (
    <SafeAreaView style={styles.container} edges={['']}>
      <View
        style={{height: useSafeAreaInsets().top, backgroundColor: '#fff'}}
      />
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <HomeHeader
        historyCount={history.length}
        onHistoryPress={() => setShowHistoryModal(true)}
        onNotificationPress={() => RootNavigation.navigate('Notification')}
        language={language}
        onLanguagePress={changeLanguage}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Hero Section - Show when no image selected and no result */}
        {!analyzing && !analysisResult && (
          <HeroSection
            onGallery={handleGallery}
            onCamera={handleCamera}
            recentResults={history}
            onViewResult={viewHistoryItem}
            onViewAllHistory={() => setShowHistoryModal(true)}
            language={language}
          />
        )}

        {/* Analysis Loading */}
        {analyzing && <AnalysisLoading language={language} />}

        {/* Analysis Result */}
        {analysisResult && (
          <AnalysisResult
            imageUri={selectedImage.uri}
            result={analysisResult}
            onReset={handleReset}
            onShare={() => {}}
            onImagePress={() => openImageViewer(selectedImage.uri)}
            language={language}
          />
        )}
      </ScrollView>

      {/* Image Picker Modal */}
      <ImagePickerModal
        visible={showImagePickerModal}
        onClose={() => setShowImagePickerModal(false)}
        onCamera={handleCamera}
        onGallery={handleGallery}
        language={language}
      />

      {/* History Modal */}
      <HistoryModal
        visible={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
        onClearAll={clearHistory}
        onViewItem={viewHistoryItem}
        onDeleteItem={deleteHistoryItem}
        onImagePress={openImageViewer}
        language={language}
      />

      {/* Image Viewer */}
      <ImageViewer
        visible={imageViewerVisible}
        images={viewerImages}
        index={0}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;
