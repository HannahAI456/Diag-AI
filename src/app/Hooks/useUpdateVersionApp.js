// src/hooks/useUpdateVersion.js
import {useState} from 'react';
import axios from 'axios';
import HotUpdate from 'react-native-ota-hot-update';
import DeviceInfo from 'react-native-device-info';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {Alert} from 'react-native';
import {Platform} from 'react-native';
import Global from '../LocalData/Global';

const API_URL = 'https://ota-update.csctech.vn';

const requestUpdateBundle = async token => {
  const endpoint = Platform.OS === 'ios' ? 'ios-ipads' : 'androids';
  const version = DeviceInfo.getVersion();
  console.log(
    'Checking updates for version:',
    `${API_URL}/api/${endpoint}?populate=*&filters[targetVersion][$eq]=${version}&sort=id:desc&filters[note][$contains]=${Global.updateVersionAppName}`,
  );
  const res = await axios.get(
    `${API_URL}/api/${endpoint}?populate=*&filters[targetVersion][$eq]=${version}&sort=id:desc&filters[note][$contains]=${Global.updateVersionAppName}`,

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log('Update bundle response:', res);
  return res.data;
};

const getJwtToken = async () => {
  try {
    const res = await axios.post(`${API_URL}/api/auth/local`, {
      identifier: 'guest@gmail.com',
      password: '1q2w3E*',
    });

    return res.data.jwt;
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Không thể lấy token xác thực');
  }
};

export const useUpdateVersion = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [updateInfo, setUpdateInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const checkUpdate = async (silentMode = false) => {
    // Tránh gọi lại khi đang loading hoặc modal đã hiện
    if (isLoading || showModal) return;
    setIsLoading(true);
    setError(null);
    try {
      const token = await getJwtToken();
      const bundle = await requestUpdateBundle(token);
      const currentVersion = await HotUpdate.getCurrentVersion();

      if (bundle?.data?.length) {
        const enabled = bundle.data.filter(item => item.enable === true);
        if (enabled.length === 0) {
          if (!silentMode) {
            Alert.alert('Thông báo', 'Không có bản cập nhật nào.');
          }
          return false;
        }

        const item = enabled[0];
        const latestVersion = item.id || 0;
        const isRequired = item.required || false;
        const updateNotes = item.note || 'Có bản cập nhật mới cho ứng dụng';

        if (latestVersion > currentVersion) {
          const bundleUrl = item?.bundle?.[0]?.url
            ? `${API_URL}${item.bundle[0].url}`
            : null;

          if (!bundleUrl) {
            const errorMsg = 'Không tìm thấy file cập nhật.';
            if (!silentMode) Alert.alert('Lỗi', errorMsg);
            setError({message: errorMsg});
            return false;
          }

          // Chỉ set state nếu khác giá trị cũ
          setUpdateInfo(prev => {
            if (
              prev &&
              prev.version === latestVersion &&
              prev.bundleUrl === bundleUrl
            ) {
              return prev;
            }
            return {
              version: latestVersion,
              notes: updateNotes,
              required: isRequired,
              bundleUrl,
            };
          });
          if (!showModal) setShowModal(true);
          return true;
        } else {
          if (!silentMode)
            Alert.alert('Thông báo', 'Bạn đang dùng phiên bản mới nhất!');
        }
      } else {
        if (!silentMode)
          Alert.alert('Thông báo', 'Không tìm thấy bản cập nhật.');
      }
    } catch (error) {
      console.error('Update check error:', error);
      const errorMsg = error.message || 'Không thể kiểm tra cập nhật';
      setError({message: errorMsg});
      if (!silentMode) {
        Alert.alert('Lỗi', errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
    return false;
  };

  const startUpdateBundle = async (url, version) => {
    // Ngăn chặn multiple downloads
    if (isDownloading) {
      console.log('Already downloading, skipping...');
      return;
    }

    setIsDownloading(true);
    setIsLoading(true);
    setError(null);
    setProgress(0);

    try {
      await HotUpdate.downloadBundleUri(ReactNativeBlobUtil, url, version, {
        updateSuccess: async () => {
          try {
            const current = await HotUpdate.getCurrentVersion();
            console.log('Update installed successfully, version:', current);
            setProgress(100);
            setShowModal(false);
            // Đợi UI update xong rồi mới restart
            setTimeout(() => {
              HotUpdate.resetApp();
            }, 1000);
          } catch (e) {
            console.error('Error in updateSuccess callback:', e);
            setError({message: 'Lỗi khi khởi động lại ứng dụng'});
            setIsLoading(false);
            setIsDownloading(false);
          }
        },
        updateFail: error => {
          console.error('Update failed:', error);
          const errorMsg = error?.message || 'Không thể cài bản cập nhật';
          setError({message: errorMsg});
          setIsLoading(false);
          setIsDownloading(false);
          setProgress(0);
        },
        restartAfterInstall: false, // Tắt auto restart, tự control
        progress: (received, total) => {
          if (total > 0) {
            const pct = Math.round((received / total) * 100);
            setProgress(Math.min(pct, 99)); // Cap at 99% until success
          }
        },
      });
    } catch (error) {
      console.error('Download error:', error);
      const errorMsg = error?.message || 'Không thể tải bản cập nhật';
      setError({message: errorMsg});
      setIsLoading(false);
      setIsDownloading(false);
      setProgress(0);
    }
  };

  const deleteUpdate = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await HotUpdate.removeUpdate();
      Alert.alert('Thành công', 'Đã xóa bản cập nhật.');
    } catch (error) {
      const errorMsg = error?.message || 'Không thể xóa bản cập nhật';
      setError({message: errorMsg});
      Alert.alert('Lỗi', errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    if (!isDownloading) {
      setShowModal(false);
      setUpdateInfo(null);
      setError(null);
      setProgress(0);
    }
  };

  return {
    checkUpdate,
    deleteUpdate,
    isLoading,
    progress,
    updateInfo,
    showModal,
    setShowModal,
    closeModal,
    startUpdateBundle,
    error,
  };
};
