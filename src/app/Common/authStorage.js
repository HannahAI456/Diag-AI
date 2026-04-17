import AsyncStorage from '@react-native-async-storage/async-storage';
import Global from '../LocalData/Global';

const AUTH_STORAGE_KEY = '@auth_user_info';

/**
 * Lưu thông tin đăng nhập vào AsyncStorage
 */
export const saveAuthToStorage = async (authData) => {
  try {
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    Global.userInfo = authData;
    return true;
  } catch (error) {
    console.error('Error saving auth to storage:', error);
    return false;
  }
};

/**
 * Đọc thông tin đăng nhập từ AsyncStorage
 */
export const loadAuthFromStorage = async () => {
  try {
    const data = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading auth from storage:', error);
    return null;
  }
};

/**
 * Xóa thông tin đăng nhập khỏi AsyncStorage
 */
export const clearAuthFromStorage = async () => {
  try {
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing auth from storage:', error);
    return false;
  }
};
