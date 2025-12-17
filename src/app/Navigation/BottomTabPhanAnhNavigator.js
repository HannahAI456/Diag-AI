import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Platform, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PhanAnh from '../Screens/PhanAnh/PhanAnh';
import PhanAnhCuaToi from '../Screens/PhanAnh/PhanAnhCuaToi';

const BottomTabNavigator = () => {
  const [activeTab, setActiveTab] = useState('PhanAnh');
  const navigation = useNavigation();

  const renderScreen = () => {
    switch (activeTab) {
      case 'PhanAnh':
        return <PhanAnh showTabBar={true} />;
      case 'PhanAnhCuaToi':
        return <PhanAnhCuaToi showTabBar={true} />;
      default:
        return <PhanAnh showTabBar={true} />;
    }
  };

  const handleNavigateToGuiPhanAnh = () => {
    navigation.navigate('GuiPhanAnh');
  };

  return (
    <View style={styles.container}>
      {/* Màn hình content */}
      <View style={styles.screenContainer}>{renderScreen()}</View>

      {/* Custom Tab Bar */}
      <View style={styles.tabBar}>
        {/* Tab 1: Phản ánh */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('PhanAnh')}
          activeOpacity={0.7}>
          <Icon
            name={
              activeTab === 'PhanAnh' ? 'comment-text' : 'comment-text-outline'
            }
            size={24}
            color={activeTab === 'PhanAnh' ? '#2196F3' : '#999'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'PhanAnh' && styles.tabLabelActive,
            ]}>
            Phản ánh
          </Text>
        </TouchableOpacity>

        {/* Tab giữa: Nút tròn tạo phản ánh */}
        <View style={styles.centerTabButton}>
          <TouchableOpacity
            style={styles.centerButton}
            onPress={handleNavigateToGuiPhanAnh}
            activeOpacity={0.8}>
            <Icon name="plus" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Tab 3: Phản ánh của tôi */}
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab('PhanAnhCuaToi')}
          activeOpacity={0.7}>
          <Icon
            name={activeTab === 'PhanAnhCuaToi' ? 'account' : 'account-outline'}
            size={24}
            color={activeTab === 'PhanAnhCuaToi' ? '#2196F3' : '#999'}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === 'PhanAnhCuaToi' && styles.tabLabelActive,
            ]}>
            Của tôi
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 88 : 68, // Để nội dung không bị che bởi tab bar
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 100, // Tăng rất cao
    zIndex: 100, // Thêm zIndex cao
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    color: '#999',
  },
  tabLabelActive: {
    color: '#2196F3',
  },
  centerTabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2196F3',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 101, // Cao hơn tab bar
    zIndex: 101, // Cao hơn tab bar
    borderWidth: 4,
    borderColor: '#fff',
    marginTop: -30, // Nổi lên trên
  },
});
