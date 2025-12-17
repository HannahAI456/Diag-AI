import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {RootNavigation} from '../../Common/RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {useSafeArea, useSafeAreaInsets} from 'react-native-safe-area-context';
import DeviceInfo from 'react-native-device-info';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import TopNavigation from '../../Components/TopNavigation';
import {useRecoilState} from 'recoil';
import {authState, menuState} from '../../Common/authAtom';
import {clearAuthFromStorage} from '../../Common/authStorage';
import {guestLogin, getMenu} from '../../Api/Actions';
import {showToast} from '../../Components/ToastConfig';
import Global from '../../LocalData/Global';
import {postJson} from '../../Api/Api';
import Geolocation from '@react-native-community/geolocation';

export default function ProfileScreen() {
  const STORAGE_KEY = '@fishing_alert_subscriber';
  const [dataTBTauCa, setDataTBTauCa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Recoil states
  const [auth, setAuth] = useRecoilState(authState);
  const [menu, setMenu] = useRecoilState(menuState);

  const loadData = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      setDataTBTauCa(raw ? JSON.parse(raw) : null);
    } catch (e) {
      setDataTBTauCa(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );

  const isSubscribed = !!dataTBTauCa?.DKTB;

  // Hàm đăng xuất
  const handleLogout = async () => {
    Alert.alert(
      'Xác nhận đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);

              // Lấy vị trí hiện tại
              const getCurrentLocation = () => {
                return new Promise(resolve => {
                  Geolocation.getCurrentPosition(
                    position => {
                      resolve({
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                      });
                    },
                    error => {
                      console.log('Error getting location:', error);
                      resolve({longitude: 0, latitude: 0});
                    },
                    {
                      enableHighAccuracy: false,
                      timeout: 5000,
                      maximumAge: 10000,
                    },
                  );
                });
              };

              const location = await getCurrentLocation();

              // Gọi API đăng xuất
              const deviceInfo = {
                deviceId: Global.DeviceID || (await DeviceInfo.getUniqueId()),
                version: DeviceInfo.getVersion(),
                model: DeviceInfo.getModel(),
                platform: Platform.OS,
                deviceName:
                  Global.tenThietBi || (await DeviceInfo.getDeviceName()),
                token: Global.tokenFirebase || '',
                userName: auth.user?.unique_name || 'guest',
                longitude: location.longitude,
                latitude: location.latitude,
              };

              try {
                await postJson('/api/app/mobile-device', deviceInfo);
                console.log('Đã gửi thông tin đăng xuất lên server');
              } catch (error) {
                console.log('Lỗi khi gửi thông tin đăng xuất:', error);
              }

              // Xóa thông tin đăng nhập đã lưu
              await clearAuthFromStorage();

              // Đăng nhập lại bằng tài khoản guest
              const guestResult = await guestLogin('guest', '1q2w3E*');

              if (guestResult.success) {
                // Lấy menu mới
                const newMenu = await getMenu();
                Global.userInfo = null;
                // Reset Recoil state về guest
                setAuth({
                  isLoggedIn: false,
                  user: null,
                  accessToken: null,
                });
                setMenu(newMenu || []);

                showToast(
                  'success',
                  'Đăng xuất thành công',
                  'Đã chuyển về tài khoản guest',
                );

                // Quay về màn hình Home
                RootNavigation.navigate('Home');
              } else {
                throw new Error('Không thể đăng nhập tài khoản guest');
              }
            } catch (error) {
              console.error('Logout error:', error);
              showToast('error', 'Lỗi', 'Đã có lỗi xảy ra khi đăng xuất');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0984e3" />
      </SafeAreaView>
    );
  }

  return (
    <View style={[styles.safeArea]}>
      <TopNavigation title="Thông tin cá nhân" navigation={RootNavigation} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* User Info Card - Nếu đã đăng nhập */}
        {auth.isLoggedIn && (
          <TouchableOpacity activeOpacity={0.7} style={styles.userInfoCard}>
            <View style={styles.userInfoLeft}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={32} color="#0984e3" />
              </View>
              <View style={styles.userTextContainer}>
                <Text style={styles.userName}>
                  {auth.user?.unique_name || 'Người dùng'}
                </Text>
                {auth.user?.email && (
                  <Text style={styles.userEmail}>{auth.user.email}</Text>
                )}
              </View>
            </View>
            <View style={styles.verifiedBadge}>
              <Ionicons
                name="arrow-forward-circle-sharp"
                size={24}
                color="#27ae60"
              />
            </View>
          </TouchableOpacity>
        )}

        {/* Subscription Status Card */}
        {isSubscribed && (
          <View style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="notifications" size={20} color="#0984e3" />
              <Text style={styles.statusTitle}>Thông báo tàu cá</Text>
            </View>

            <View style={[styles.statusBadge, styles.activeBadge]}>
              <Ionicons name="checkmark-circle" size={18} color="#27ae60" />
              <Text style={[styles.statusText, styles.activeText]}>
                Đã đăng ký
              </Text>
            </View>
          </View>
        )}

        {/* Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>CÀI ĐẶT</Text>
          <View style={styles.menuCard}>
            <TouchableOpacity
              style={styles.menuItem}
              // onPress={() => RootNavigation.navigate('ThongTinUngDung')}
              activeOpacity={0.7}>
              <View style={styles.menuItemLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="information-circle-outline"
                    size={20}
                    color="#0984e3"
                  />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuItemTitle}>Thông tin ứng dụng</Text>
                  <Text style={styles.menuItemSubtitle}>
                    Phiên bản {DeviceInfo.getVersion()}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
            </TouchableOpacity>
          </View>
          <View style={styles.actionButtonContainer}>
            {auth.isLoggedIn ? (
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
                disabled={loggingOut}
                activeOpacity={0.8}>
                {loggingOut ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="log-out-outline" size={22} color="#fff" />
                    <Text style={styles.logoutButtonText}>Đăng xuất</Text>
                  </>
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={() => RootNavigation.navigate('LoginScreen')}
                activeOpacity={0.8}>
                <Ionicons name="log-in-outline" size={22} color="#fff" />
                <Text style={styles.loginButtonText}>Đăng nhập</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  userInfoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.08,
    // shadowRadius: 4,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0984e3',
  },
  userTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  verifiedBadge: {
    backgroundColor: '#d5f4e6',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 16,
    padding: 20,
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 1},
    // shadowOpacity: 0.08,
    // shadowRadius: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginLeft: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#d5f4e6',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  activeText: {
    color: '#27ae60',
  },
  menuSection: {
    marginTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#95a5a6',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconActive: {
    backgroundColor: '#d5f4e6',
  },
  iconDefault: {
    backgroundColor: '#e3f2fd',
  },
  menuTextContainer: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#95a5a6',
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginLeft: 68,
  },
  actionButtonContainer: {
    marginTop: 30,
  },
  loginButton: {
    backgroundColor: '#27ae60',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#27ae60',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#e74c3c',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
