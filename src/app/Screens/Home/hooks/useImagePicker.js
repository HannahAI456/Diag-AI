import React from 'react';
import {Alert, Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

export const useImagePicker = () => {
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

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Không có quyền truy cập',
        'Vui lòng cấp quyền camera trong cài đặt',
      );
      return null;
    }

    try {
      const image = await ImagePicker.openCamera({
        width: 2000,
        height: 2000,
        cropping: true,
        cropperCircleOverlay: false,
        compressImageQuality: 0.8,
        mediaType: 'photo',
        includeBase64: false,
        cropperToolbarTitle: 'Chỉnh sửa ảnh',
        cropperChooseText: 'Chọn',
        cropperCancelText: 'Hủy',
        loadingLabelText: 'Đang xử lý...',
        cropperRotateButtonsHidden: false,
        cropperActiveWidgetColor: '#2196F3',
        cropperStatusBarColor: '#1976D2',
        cropperToolbarColor: '#2196F3',
        freeStyleCropEnabled: true,
      });

      return {
        uri: image.path,
        type: image.mime || 'image/jpeg',
        name: `photo_${Date.now()}.jpg`,
        width: image.width,
        height: image.height,
      };
    } catch (error) {
      console.log('Camera error:', error);
      if (
        error.message !== 'User cancelled image selection' &&
        error.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Camera error:', error);
        Alert.alert('Lỗi', 'Không thể mở camera');
      }
      return null;
    }
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: false,
        compressImageQuality: 0.8,
        includeBase64: false,
      });

      // Sau khi chọn xong, mở cropper
      try {
        const croppedImage = await ImagePicker.openCropper({
          path: image.path,
          width: 2000,
          height: 2000,
          cropperCircleOverlay: false,
          compressImageQuality: 0.8,
          mediaType: 'photo',
          includeBase64: false,
          cropperToolbarTitle: 'Chỉnh sửa ảnh',
          cropperChooseText: 'Chọn',
          cropperCancelText: 'Hủy',
          loadingLabelText: 'Đang xử lý...',
          cropperRotateButtonsHidden: false,
          cropperActiveWidgetColor: '#2196F3',
          cropperStatusBarColor: '#1976D2',
          cropperToolbarColor: '#2196F3',
          freeStyleCropEnabled: true,
        });

        return {
          uri: croppedImage.path,
          type: croppedImage.mime || 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
          width: croppedImage.width,
          height: croppedImage.height,
        };
      } catch (cropError) {
        // Nếu user cancel cropper, trả về ảnh gốc
        console.log('User cancelled cropping, using original image');
        return {
          uri: image.path,
          type: image.mime || 'image/jpeg',
          name: `photo_${Date.now()}.jpg`,
          width: image.width,
          height: image.height,
        };
      }
    } catch (error) {
      console.log('Gallery error:', error);
      if (
        error.message !== 'User cancelled image selection' &&
        error.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Gallery error:', error);
        Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
      }
      return null;
    }
  };

  return {
    openCamera,
    openGallery,
  };
};
