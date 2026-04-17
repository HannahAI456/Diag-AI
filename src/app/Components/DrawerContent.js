import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AppColors} from '../Common/AppColor';
import {MAX_H, MAX_W} from '../Common/GlobalStyles';
import RenderHTML from 'react-native-render-html';
import Global from '../LocalData/Global';
import LinearGradient from 'react-native-linear-gradient';

const DrawerContent = ({onClose, navigation}) => {
  const menuItems = [
    {
      id: '1',
      title: 'Trang chủ',
      icon: 'home',
      screen: 'Home',
    },
    {
      id: '2',
      title: 'Cá nhân',
      icon: 'user',
      screen: 'ProfileScreen',
    },
  ];

  const handleMenuPress = item => {
    if (onClose) {
      onClose();
    }
    if (navigation && item.screen) {
      setTimeout(() => {
        navigation.navigate(item.screen);
      }, 300);
    }
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:02903833025');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@snn.camau.gov.vn');
  };

  const handleAddressPress = () => {
    Linking.openURL(
      'https://maps.google.com/?q=Số 77, đường Ngô Quyền, phường An Xuyên, tỉnh Cà Mau',
    );
  };
  console.log('DrawerContent rendered', Global.userInfo);
  return (
    <View style={styles.container}>
      {/* Header */}
      <ImageBackground
        source={require('../../asset/Image/Home/Banner-Nong-nghiep-Ca-Mau-Resize-app.png')}
        style={styles.header}
      />
      {/* <View style={styles.header} /> */}
      {/* Menu Items */}

      <ScrollView
        style={styles.menuContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        <View>
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: AppColors.MainColor,
              marginLeft: 20,
              // marginBottom: 10,
            }}>
            Xin chào,{' '}
            {Global.userInfo
              ? `${Global?.userInfo?.user?.given_name} `
              : 'Người dùng ẩn danh'}
          </Text>
        </View>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.menuItemLast,
            ]}
            onPress={() => handleMenuPress(item)}
            activeOpacity={0.7}>
            <View style={styles.menuIconContainer}>
              <Icon name={item.icon} size={24} color={AppColors.MainColor} />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        {/* Footer */}
        <LinearGradient colors={['#1e4d47', '#19695e']} style={styles.footer}>
          <View style={styles.footerContent}>
            {/* Title */}
            <Text style={styles.footerTitle}>
              SỞ NÔNG NGHIỆP VÀ MÔI TRƯỜNG{'\n'}TỈNH CÀ MAU
            </Text>

            {/* Description */}
            <Text style={styles.footerDescription}>
              Nền tảng dữ liệu ngành Nông nghiệp & Môi trường. Cập nhật thông
              tin minh bạch, nhanh, chính xác.
            </Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Contact Section */}
            <Text style={styles.contactTitle}>Liên hệ</Text>

            {/* Address */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleAddressPress}
              activeOpacity={0.7}>
              <Icon
                name="map-marker"
                size={16}
                color="#fff"
                style={styles.contactIcon}
              />
              <Text style={styles.contactText}>
                Số 77, đường Ngô Quyền, phường An Xuyên, tỉnh Cà Mau
              </Text>
            </TouchableOpacity>

            {/* Phone */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handlePhonePress}
              activeOpacity={0.7}>
              <Icon
                name="phone"
                size={16}
                color="#fff"
                style={styles.contactIcon}
              />
              <Text style={styles.contactText}>(0290) 3833 025</Text>
            </TouchableOpacity>

            {/* Email */}
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleEmailPress}
              activeOpacity={0.7}>
              <Icon
                name="envelope"
                size={16}
                color="#fff"
                style={styles.contactIcon}
              />
              <Text style={styles.contactText}>info@snn.camau.gov.vn</Text>
            </TouchableOpacity>

            {/* Copyright */}
            <View style={styles.copyrightContainer}>
              <Text style={styles.copyrightText}>
                © 2025 Sở Nông nghiệp và Môi trường tỉnh Cà Mau
              </Text>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  header: {
    // backgroundColor: AppColors.MainColor,
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    height: MAX_H * 0.3,
    justifyContent: 'center',
    alignContent: 'center',
  },
  menuContainer: {
    flex: 1,
    // paddingTop: -100,
    // alignSelf:'flex-end'
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f8ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    marginTop: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    // borderTopLeftRadius: 20,
    borderTopRightRadius: 50,
  },
  footerContent: {
    width: '100%',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 22,
  },
  footerDescription: {
    fontSize: 13,
    color: '#e0e0e0',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 15,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingLeft: 5,
  },
  contactIcon: {
    marginRight: 10,
    marginTop: 2,
    width: 20,
  },
  contactText: {
    flex: 1,
    fontSize: 13,
    color: '#e0e0e0',
    lineHeight: 20,
  },
  copyrightContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  copyrightText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default DrawerContent;
