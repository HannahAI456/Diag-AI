// App.js
import React, {useEffect, useState, useMemo} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import AppContainer from './src/app/AppContainer';
import HotUpdate from 'react-native-ota-hot-update';
import {useUpdateVersion} from './src/app/Hooks/useUpdateVersionApp';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {RecoilRoot} from 'recoil';
import Toast from 'react-native-toast-message';
import {SafeAreaView} from 'react-native-safe-area-context';
import 'react-native-reanimated';

const {width} = Dimensions.get('window');
const isSmallScreen = width < 360;

const UpdateModal = ({
  visible,
  updateInfo,
  onClose,
  onUpdate,
  isLoading,
  progress,
  error,
}) => {
  if (!updateInfo) return null;

  const isRequired = !!updateInfo.required;

  return (
    <Modal
      visible={visible}
      transparent
      animationType={isRequired ? 'none' : 'fade'}
      onRequestClose={() => {
        if (!isRequired) onClose();
      }}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Icon name="system-update" size={28} color="#4285F4" />
            <Text style={styles.modalTitle}>Bản cập nhật mới</Text>
          </View>

          <View style={[styles.modalBody, {marginTop: 10}]}>
            <Text style={styles.notesText}>
              Đã có bản cập nhật mới.{'\n'}Vui lòng cập nhật để có trải nghiệm
              tốt nhất.
            </Text>
            {isRequired && !isLoading && (
              <Text
                style={[styles.notesText, {marginTop: 6, color: '#D93025'}]}>
                Cập nhật bắt buộc — đang chuẩn bị tải…
              </Text>
            )}
            {error && (
              <Text
                style={[styles.notesText, {marginTop: 6, color: '#D93025'}]}>
                Lỗi: {error.message}. Vui lòng thử lại.
              </Text>
            )}
          </View>

          {isLoading && (
            <View style={styles.modalBody}>
              <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                  {progress < 100
                    ? `Đang tải: ${progress}%`
                    : 'Đang áp dụng cập nhật...'}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[styles.progressFill, {width: `${progress}%`}]}
                  />
                </View>
              </View>
            </View>
          )}

          <View style={styles.modalFooter}>
            {!isRequired && !isLoading && (
              <TouchableOpacity
                style={[styles.button, styles.buttonSecondary]}
                onPress={onClose}>
                <Text style={styles.buttonSecondaryText}>Để sau</Text>
              </TouchableOpacity>
            )}
            {error && (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() =>
                  onUpdate(updateInfo.bundleUrl, updateInfo.version)
                }>
                <Icon name="refresh" size={16} color="#FFF" />
                <Text style={styles.buttonPrimaryText}>Thử lại</Text>
              </TouchableOpacity>
            )}
            {!isRequired && !isLoading && !error && (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() =>
                  onUpdate(updateInfo.bundleUrl, updateInfo.version)
                }>
                <Icon name="download" size={16} color="#FFF" />
                <Text style={styles.buttonPrimaryText}>Cập nhật ngay</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const App = () => {
  const {
    checkUpdate,
    isLoading,
    progress,
    updateInfo,
    showModal,
    closeModal,
    startUpdateBundle,
    error,
  } = useUpdateVersion();

  const [initialized, setInitialized] = useState(false);
  const [checkingForUpdates, setCheckingForUpdates] = useState(true);
  const [hasStartedRequiredUpdate, setHasStartedRequiredUpdate] =
    useState(false);

  const memoizedUpdateInfo = useMemo(
    () => updateInfo,
    [updateInfo?.version, updateInfo?.bundleUrl],
  );

  useEffect(() => {
    const init = async () => {
      try {
        const v = await HotUpdate.getCurrentVersion();
        console.log('App started with bundle version:', v);
        const hasUpdate = await checkUpdate(true);
        if (!hasUpdate) setTimeout(() => setInitialized(true), 800);
      } catch (e) {
        console.warn('Initialization error:', e);
        setInitialized(true);
      } finally {
        setCheckingForUpdates(false);
      }
    };
    init();
  }, []);

  // Auto-start required update - chỉ chạy 1 lần
  useEffect(() => {
    if (
      showModal &&
      memoizedUpdateInfo?.required &&
      !isLoading &&
      !error &&
      !hasStartedRequiredUpdate
    ) {
      setHasStartedRequiredUpdate(true);
      startUpdateBundle(
        memoizedUpdateInfo.bundleUrl,
        memoizedUpdateInfo.version,
      );
    }
  }, [showModal, memoizedUpdateInfo?.required, isLoading, error]);

  // Reset flag when modal closes
  useEffect(() => {
    if (!showModal) {
      setHasStartedRequiredUpdate(false);
    }
  }, [showModal]);

  const handleCloseModal = () => {
    closeModal();
    if (memoizedUpdateInfo && !memoizedUpdateInfo.required)
      setInitialized(true);
  };

  const canEnterApp = initialized && !showModal;

  return (
    <RecoilRoot>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {canEnterApp ? (
        <>
          <SafeAreaView
            edges={['bottom']}
            style={{flex: 1, backgroundColor: 'white', marginBottom: 0}}>
            <AppContainer />
            <Toast />
          </SafeAreaView>
        </>
      ) : (
        <ImageBackground
          source={require('./src/asset/Image/ai-medical-documentation-billing-mobile.jpg')}
          style={styles.container}
          resizeMode="cover">
          {!showModal && (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color="#1A73E8" />
              <Text style={styles.loadingText}>
                {checkingForUpdates
                  ? 'Đang kiểm tra cập nhật…'
                  : 'Đang tải dữ liệu...'}
              </Text>
            </View>
          )}

          <UpdateModal
            visible={showModal}
            updateInfo={memoizedUpdateInfo}
            onClose={handleCloseModal}
            onUpdate={startUpdateBundle}
            isLoading={isLoading}
            progress={progress}
            error={error}
          />
        </ImageBackground>
      )}
    </RecoilRoot>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  loadingText: {
    marginTop: 10,
    fontSize: isSmallScreen ? 14 : 16,
    color: '#5F6368',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * (isSmallScreen ? 0.9 : 0.8),
    maxWidth: 500,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: isSmallScreen ? 20 : 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {elevation: 8},
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: isSmallScreen ? 20 : 22,
    fontWeight: '700',
    color: '#212121',
    marginLeft: 12,
  },
  modalBody: {
    marginBottom: 20,
  },
  notesText: {
    fontSize: isSmallScreen ? 14 : 15,
    color: '#5F6368',
    lineHeight: 22,
    textAlign: 'center',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 12,
    width: '100%',
  },
  progressText: {
    marginBottom: 8,
    fontSize: isSmallScreen ? 14 : 15,
    color: '#5F6368',
    fontWeight: '500',
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#E8EAED',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1A73E8',
    borderRadius: 5,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {elevation: 3},
    }),
  },
  buttonPrimary: {
    backgroundColor: '#1A73E8',
  },
  buttonSecondary: {
    backgroundColor: '#F1F3F4',
    borderWidth: 1,
    borderColor: '#DADCE0',
  },
  buttonPrimaryText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: isSmallScreen ? 15 : 16,
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  buttonSecondaryText: {
    color: '#3C4043',
    fontWeight: '600',
    fontSize: isSmallScreen ? 15 : 16,
    letterSpacing: 0.3,
  },
});

// import React, {useState, useEffect, useRef} from 'react';
// import {
//   View,
//   Text,
//   Platform,
//   ActivityIndicator,
//   Modal,
//   StyleSheet,
//   TouchableOpacity,
//   ImageBackground,
//   Dimensions,
//   Animated,
// } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';
// import HotUpdate from 'react-native-ota-hot-update';
// import {RecoilRoot, useRecoilValue} from 'recoil';
// import AppContainer from './src/app/AppContainer';
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import {useUpdateVersion} from './src/app/Hooks/useUpdateVersionApp';
// // import {isLoginState, PinnedDocumentsState} from './src/app/Common/atom';
// import {AppColors} from './src/app/Common/AppColor';
// import {RootNavigation} from './src/app/Common/RootNavigation';

// const {width, height} = Dimensions.get('window');
// const isSmallScreen = width < 360;

// const UpdateModal = ({
//   visible,
//   updateInfo,
//   onClose,
//   onUpdate,
//   isLoading,
//   progress,
// }) => {
//   if (!updateInfo) return null;

//   return (
//     <Modal
//       visible={visible}
//       transparent={true}
//       animationType="fade"
//       onRequestClose={() => {
//         if (!updateInfo.required) {
//           onClose();
//         }
//       }}>
//       <View style={styles.modalOverlay}>
//         <View style={styles.modalContainer}>
//           <View style={styles.modalHeader}>
//             <Icon name="system-update" size={28} color="#4285F4" />
//             <Text style={styles.modalTitle}>Bản cập nhật mới</Text>
//           </View>
//           <View style={[styles.modalBody, {marginTop: 10}]}>
//             <Text style={styles.notesText}>
//               Đã có bản cập nhật mới.{'\n'}Vui lòng cập nhật để có trải nghiệm
//               tốt nhất.
//             </Text>
//           </View>
//           {isLoading && (
//             <View style={styles.modalBody}>
//               {/* <Text style={styles.versionText}>
//                 Phiên bản: {updateInfo.version}
//               </Text> */}
//               {isLoading && (
//                 <View style={styles.progressContainer}>
//                   {/* <ActivityIndicator size="large" color="#4285F4" /> */}
//                   <Text style={styles.progressText}>Đang tải: {progress}%</Text>
//                   <View style={styles.progressBar}>
//                     <View
//                       style={[styles.progressFill, {width: `${progress}%`}]}
//                     />
//                   </View>
//                 </View>
//               )}
//             </View>
//           )}

//           <View style={styles.modalFooter}>
//             {!updateInfo.required && !isLoading && (
//               <TouchableOpacity
//                 style={[styles.button, styles.buttonSecondary]}
//                 onPress={onClose}>
//                 <Text style={styles.buttonSecondaryText}>Để sau</Text>
//               </TouchableOpacity>
//             )}

//             {!isLoading && (
//               <TouchableOpacity
//                 style={[styles.button, styles.buttonPrimary]}
//                 onPress={() =>
//                   onUpdate(updateInfo.bundleUrl, updateInfo.version)
//                 }>
//                 <Icon name="download" size={16} color="#FFF" />
//                 <Text style={styles.buttonPrimaryText}>Cập nhật ngay</Text>
//               </TouchableOpacity>
//             )}
//           </View>
//         </View>
//       </View>
//     </Modal>
//   );
// };

// const AppInitializer = () => {
//   const {
//     checkUpdate,
//     deleteUpdate,
//     isLoading,
//     progress,
//     updateInfo,
//     showModal,
//     closeModal,
//     startUpdateBundle,
//   } = useUpdateVersion();
//   const [tiepTuc, setTiepTuc] = useState(false);
//   const [initialized, setInitialized] = useState(false);
//   const [checkingForUpdates, setCheckingForUpdates] = useState(true);
//   // const pinnedItems = useRecoilValue(PinnedDocumentsState);
//   const scaleAnim = useRef(new Animated.Value(1)).current;
//   // const isLogin = useRecoilValue(isLoginState);
//   // Animation refs for tooltip
//   const tooltipOpacity = useRef(new Animated.Value(0)).current;
//   const tooltipTranslateY = useRef(new Animated.Value(20)).current;
//   const [showTooltip, setShowTooltip] = useState(false);
//   const [hasShownTooltip, setHasShownTooltip] = useState(false);

//   // Kiểm tra cập nhật khi khởi động ứng dụng
//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         await HotUpdate.getCurrentVersion().then(version => {
//           console.log('App started with bundle version:', version);
//         });
//         const hasUpdate = await checkUpdate(true);
//         if (!hasUpdate) {
//           setTimeout(() => {
//             setInitialized(true);
//           }, 1000);
//         }
//       } catch (error) {
//         console.error('Initialization error:', error);
//         setInitialized(true);
//       } finally {
//         setCheckingForUpdates(false);
//       }
//     };

//     initialize();
//   }, []);

//   // Xử lý khi người dùng đóng modal cập nhật
//   const handleCloseModal = () => {
//     closeModal();
//     // Nếu không phải cập nhật bắt buộc, cho phép tiếp tục
//     if (updateInfo && !updateInfo.required) {
//       setInitialized(true);
//     }
//   };

//   // Nếu đã khởi tạo và người dùng chọn tiếp tục, hiển thị ứng dụng chính
//   if ((initialized || tiepTuc) && !showModal) {
//     return (
//       <View style={{flex: 1}}>
//         <AppContainer />
//       </View>
//     );
//   }

//   return (
//     <ImageBackground
//       source={require('./src/asset/Image/Splash/Banner-Nong-nghiep-Ca-Mau_loading.png')}
//       blurRadius={0}
//       style={styles.container}>
//       <UpdateModal
//         visible={showModal}
//         updateInfo={updateInfo}
//         onClose={handleCloseModal}
//         onUpdate={startUpdateBundle}
//         isLoading={isLoading}
//         progress={progress}
//       />
//     </ImageBackground>
//   );
// };

// export const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   headerContainer: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   headerTitle: {
//     fontSize: isSmallScreen ? 22 : 24,
//     fontWeight: '700',
//     color: '#212121',
//     marginTop: 10,
//   },
//   versionInfo: {
//     fontSize: isSmallScreen ? 14 : 16,
//     color: '#5F6368',
//     marginBottom: 20,
//   },
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   loadingText: {
//     marginTop: 10,
//     fontSize: isSmallScreen ? 14 : 16,
//     color: '#5F6368',
//   },
//   progressText: {
//     marginTop: 10,
//     fontSize: isSmallScreen ? 13 : 14,
//     color: '#5F6368',
//   },
//   buttonContainer: {
//     width: '100%',
//     marginTop: 20,
//     paddingHorizontal: 20,
//   },
//   mainButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginBottom: 12,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 2},
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 3,
//       },
//     }),
//   },
//   checkButton: {
//     backgroundColor: '#1A73E8', // Modern blue
//   },
//   deleteButton: {
//     backgroundColor: '#D93025', // Modern red
//   },
//   continueButton: {
//     backgroundColor: '#34A853', // Modern green
//   },
//   mainButtonText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: isSmallScreen ? 15 : 16,
//     marginLeft: 8,
//   },
//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   modalContainer: {
//     width: width * (isSmallScreen ? 0.85 : 0.75), // Responsive width
//     maxWidth: 500, // Cap for large screens
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16, // Softer corners
//     padding: isSmallScreen ? 16 : 24,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 4},
//         shadowOpacity: 0.3,
//         shadowRadius: 8,
//       },
//       android: {
//         elevation: 6,
//       },
//     }),
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   modalTitle: {
//     fontSize: isSmallScreen ? 18 : 20,
//     fontWeight: '700',
//     color: '#212121',
//     marginLeft: 10,
//   },
//   modalBody: {
//     marginBottom: 20,
//   },
//   versionText: {
//     fontSize: isSmallScreen ? 15 : 16,
//     fontWeight: '600',
//     color: '#212121',
//     marginBottom: 10,
//   },
//   notesText: {
//     fontSize: isSmallScreen ? 13 : 14,
//     color: '#5F6368',
//     lineHeight: 20,
//     marginBottom: 15,
//   },
//   progressContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   progressBar: {
//     width: '100%',
//     height: 8, // Thinner progress bar
//     backgroundColor: '#E8EAED',
//     borderRadius: 4,
//     marginTop: 8,
//     overflow: 'hidden',
//   },
//   progressFill: {
//     height: '100%',
//     backgroundColor: '#1A73E8', // Match button color
//     borderRadius: 4,
//   },
//   modalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'space-between', // Evenly spaced buttons
//     marginTop: 16,
//     paddingHorizontal: 10,
//   },
//   button: {
//     flex: 1, // Equal width for buttons
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginHorizontal: 5, // Space between buttons
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 1},
//         shadowOpacity: 0.2,
//         shadowRadius: 2,
//       },
//       android: {
//         elevation: 2,
//       },
//     }),
//   },
//   buttonPrimary: {
//     backgroundColor: '#1A73E8', // Modern blue
//   },
//   buttonSecondary: {
//     backgroundColor: '#F1F3F4', // Light gray
//     borderWidth: 1,
//     borderColor: '#DADCE0', // Subtle border
//   },
//   buttonPrimaryText: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//     fontSize: isSmallScreen ? 14 : 15,
//     letterSpacing: 0.2,
//     marginLeft: 8,
//   },
//   buttonSecondaryText: {
//     color: '#3C4043',
//     fontWeight: '600',
//     fontSize: isSmallScreen ? 14 : 15,
//     letterSpacing: 0.2,
//     textAlign: 'center',
//   },
//   requiredText: {
//     fontSize: isSmallScreen ? 11 : 12,
//     color: '#D93025', // Match delete button
//     textAlign: 'center',
//     marginLeft: 5,
//   },
//   // Tooltip styles
//   tooltip: {
//     position: 'absolute',
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 6,
//     maxWidth: 200,
//     ...Platform.select({
//       ios: {
//         shadowColor: '#000',
//         shadowOffset: {width: 0, height: 2},
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//       },
//       android: {
//         elevation: 4,
//       },
//     }),
//   },
//   tooltipText: {
//     color: '#FFFFFF',
//     fontSize: isSmallScreen ? 12 : 13,
//     fontWeight: '500',
//     textAlign: 'center',
//   },
//   tooltipArrow: {
//     position: 'absolute',
//     left: -10,
//     bottom: 15, // Center vertically
//     width: 0,
//     height: 0,
//     borderTopWidth: 8,
//     borderTopColor: 'transparent',
//     borderBottomWidth: 8,
//     borderBottomColor: 'transparent',
//     borderRightWidth: 10,
//     borderRightColor: 'rgba(0, 0, 0, 0.8)',
//   },
// });

// const App = () => {
//   return (
//     <RecoilRoot>
//       <AppInitializer />
//     </RecoilRoot>
//   );
// };

// export default App;
