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
  Image,
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
  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    setAppVersion(DeviceInfo.getVersion());
  }, []);

  return (
    <View style={[styles.safeArea]}>
      <TopNavigation title="Thông tin" navigation={RootNavigation} />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {/* App Info Card */}
        <View style={styles.appInfoCard}>
          <View style={styles.appIconContainer}>
            <Image
              style={{height: 60, width: 60}}
              source={require('../../../asset/Icons/main.png')}
            />
          </View>

          <Text style={styles.appTitle}>Ứng dụng Diag AI</Text>
          <Text style={styles.appDescription}>
            Hỗ trợ chuẩn đoán bệnh tay chân miệng{'\n'}trên trẻ em
          </Text>

          <View style={styles.versionContainer}>
            <MaterialIcons name="info-outline" size={16} color="#666" />
            <Text style={styles.versionText}>Phiên bản: {appVersion}</Text>
          </View>
        </View>

        {/* Authors Section */}
        <View style={styles.authorsSection}>
          <Text style={styles.sectionTitle}>TÁC GIẢ</Text>

          <View style={styles.authorCard}>
            <View style={styles.authorItem}>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>Trần Lê Bảo Hân</Text>
                <Text style={styles.authorSchool}>
                  Trường Phổ thông Năng khiếu, ĐHQG-HCM
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.authorItem}>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>Nguyễn Minh Quân</Text>
                <Text style={styles.authorSchool}>
                  Trường Phổ thông Năng khiếu, ĐHQG-HCM
                </Text>
              </View>
            </View>
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
  scrollView: {
    flex: 1,
  },
  appInfoCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  appIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1565C0',
    marginBottom: 8,
    textAlign: 'center',
  },
  appDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  versionText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 6,
    fontWeight: '500',
  },
  authorsSection: {
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
  authorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  authorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  authorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  authorSchool: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: '#ecf0f1',
    marginLeft: 76,
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
