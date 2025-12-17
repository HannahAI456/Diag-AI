import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {PermissionsAndroid, Platform, Alert} from 'react-native';
import {RootNavigation} from './RootNavigation';
import Global from '../LocalData/Global';

// Yêu cầu quyền thông báo từ người dùng (dành cho iOS hoặc Android 13 trở lên)
const requestUserPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      console.log('Permission not granted on iOS');
    }
  } else if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Notification Permission',
        message: 'This app needs access to notifications',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );

    // if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
    //   console.log('Notification permission denied on Android');
    //   Alert.alert(
    //     'Permission Required',
    //     'Notification permission is required to receive notifications',
    //   );
    // }
  }
};
const renderNavi = item => {
  console.log('...', item);
  switch (item.data.type) {
    case 'thong-bao-tin-tuc':
      RootNavigation.navigate('ChiTietBaiViet', {
        item: {id: item.data?.iddulieu},
        Ma: 'TinTucNhomTin',
        LienKet:
          'tin-tuc-bai-viet?SkipCount=0&MaxResultCount=4&loaiTinTuc=tintuc',
        useShare: false,
      });
      break;

    case 'phatBieuTranhLuan':
      RootNavigation.navigate('FeedbackListScreen', {
        id: item.data?.iddulieu,
      });
      break;
    case 'thongBaoChatVan':
      RootNavigation.navigate('QuestionListScreen', {
        id: item.data?.iddulieu,
      });
      break;
    // case 'HuongDanUngPho':
    //   RootNavigation.navigate('ChiTietKienThuc', {
    //     data: {id: item.data?.iddulieu},
    //   });
    //   break;
    // case 'TinTuc':
    //   RootNavigation.navigate('ChiTietTinTucThienTai', {
    //     data: {id: item.data?.iddulieu},
    //   });
    //   break;
    // case 'TiepNhanPhanAnh':
    //   RootNavigation.navigate('ChiTietPhanAnh', {
    //     data: {id: item.data?.iddulieu},
    //   });
    //   break;
    // case 'PhanHoiUngCuu':
    //   RootNavigation.navigate('ChiTietUngCuu', {
    //     data: {id: item.data?.iddulieu},
    //   });
    //   break;
    // case 'TiepNhanUngCuu':
    //   RootNavigation.navigate('ChiTietUngCuu', {
    //     data: {id: item.data?.iddulieu},
    //   });
    //   break;
    default:
      // RootNavigation.navigate('NotificationListScreenCommon');
      break;
  }
};

// Lấy token của thiết bị để sử dụng cho thông báo
const getFcmToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      Global.tokenFirebase = fcmToken;
      return fcmToken;
    } else {
      console.log('Failed to get Firebase token');
      return '';
    }
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return '';
  }
};

let handledMessageIds = new Set();

const handleForegroundNotification = () => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);

    const messageId = remoteMessage?.messageId;
    if (!messageId || handledMessageIds.has(messageId)) {
      console.log('Duplicate message ignored:', messageId);
      return;
    }

    handledMessageIds.add(messageId);
    const data = remoteMessage.data || {};
    await notifee.displayNotification({
      title: remoteMessage.notification?.title || 'Default Title',
      body: remoteMessage.notification?.body || 'Default Body',
      data: data,
      id: messageId,
      android: {
        channelId: 'default',
        importance: AndroidImportance.HIGH,
      },
    });
  });

  return unsubscribe;
};

// const registerNotificationService = async () => {
//   await requestUserPermission(); // Yêu cầu quyền
//   await getFcmToken(); // Lấy token Firebase

//   // Tạo channel cho Android
//   if (Platform.OS === 'android') {
//     await notifee.createChannel({
//       id: 'default',
//       name: 'Default Channel',
//       importance: AndroidImportance.HIGH,
//     });
//   }

//   // Xử lý thông báo khi app ở foreground
//   handleForegroundNotification();
//   messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message handled in the background!', remoteMessage);
//     renderNavi(remoteMessage);
//   });
//   messaging().onNotificationOpenedApp(remoteMessage => {
//     console.log(
//       'Notification caused app to open from background:',
//       remoteMessage.notification,
//     );
//     // renderNavi(remoteMessage);
//   });
//   notifee.onForegroundEvent(({type, detail}) => {
//     console.log('detail', detail);
//     if (type === EventType.PRESS) {
//       const {screen, params} = detail.notification.data;
//       if (screen) {
//         // Chuyển đổi params từ chuỗi JSON sang đối tượng
//         const parsedParams = params ? JSON.parse(params) : {};
//         console.log(parsedParams);
//         // navigation.navigate(screen, parsedParams);
//         RootNavigation.navigate('Bản đồ');
//       }
//       // renderNavi(detail);
//     }
//   });
//   notifee.onBackgroundEvent(async ({type, detail}) => {
//     console.log('detail', detail);
//     if (type === EventType.PRESS) {
//       const {screen, params} = detail.notification.data;
//       if (screen) {
//         // Chuyển đổi params từ chuỗi JSON sang đối tượng
//         const parsedParams = params ? JSON.parse(params) : {};
//         console.log(parsedParams);
//         RootNavigation.navigate('Bản đồ');
//       }
//       renderNavi(detail);
//     }
//   });
//   // Kiểm tra xem ứng dụng có được mở từ một thông báo trong trạng thái quit không
//   const initialNotification = await messaging().getInitialNotification();
//   if (initialNotification) {
//     console.log(
//       'Notification caused app to open from quit state:',
//       initialNotification.notification,
//     );
//   }
// };

const registerNotificationService = async () => {
  await requestUserPermission();
  const fcmToken = await getFcmToken();
  // console.log('FCM Token:', fcmToken);

  // Tạo channel cho Android
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
  }

  // Xử lý thông báo khi app ở foreground
  handleForegroundNotification();

  // Xử lý thông báo khi app ở background
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background:', remoteMessage);
    if (remoteMessage?.data?.type) {
      renderNavi(remoteMessage);
    }
  });

  // Xử lý khi người dùng nhấn vào thông báo trong trạng thái background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background:',
      remoteMessage.notification,
    );
    if (remoteMessage?.data?.type) {
      renderNavi(remoteMessage);
    }
  });

  // Xử lý khi người dùng nhấn vào thông báo trong trạng thái quit
  const initialNotification = await messaging().getInitialNotification();
  if (initialNotification) {
    console.log(
      'Notification caused app to open from quit state:',
      initialNotification.notification,
    );
    if (initialNotification?.data?.type) {
      renderNavi(initialNotification);
    }
  }

  // Xử lý sự kiện foreground hoặc background của notifee
  notifee.onForegroundEvent(({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('Foreground notification pressed:', detail);
      if (detail.notification.data) {
        renderNavi(detail.notification);
      }
    }
  });

  notifee.onBackgroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('Background notification pressed:', detail);
      if (detail.notification.data) {
        renderNavi(detail.notification);
      }
    }
  });
};

export {registerNotificationService, getFcmToken};
