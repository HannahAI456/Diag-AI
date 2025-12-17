import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

const PillTabView = ({
  tabs = [],
  onTabChange,
  // initialTab = 0, // Không cần nữa vì dùng activeTabIndex
  tabStyle = {},
  activeTabStyle = {},
  tabTextStyle = {},
  activeTabTextStyle = {},
  containerStyle = {},
  scrollViewStyle = {},
  // children, // Bỏ children vì content render bên ngoài
  // scrollY, // Bỏ animation scroll
  // hideThreshold,
  activeTabIndex = 0, // Nhận index từ HomeScreen
}) => {
  // Đồng bộ state nội bộ với props từ bên ngoài
  const [activeTab, setActiveTab] = useState(activeTabIndex);
  const scrollViewRef = useRef(null);
  const tabRefs = useRef([]);

  // Khi activeTabIndex từ cha thay đổi (ví dụ nhấn nút Back, hoặc chuyển tab), cập nhật state nội bộ
  useEffect(() => {
    setActiveTab(activeTabIndex);
  }, [activeTabIndex]);

  // Tự động cuộn thanh tab ra giữa khi tab thay đổi
  useEffect(() => {
    if (tabs.length > 0 && tabRefs.current.length > 0) {
      const timeoutId = setTimeout(() => {
        scrollTabToCenter(activeTab);
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, tabs]);

  const handleTabPress = index => {
    if (index >= 0 && index < tabs.length) {
      setActiveTab(index);
      if (onTabChange) {
        onTabChange(index); // Báo cho HomeScreen biết
      }
    }
  };

  const scrollTabToCenter = index => {
    if (scrollViewRef.current && tabRefs.current[index]) {
      setTimeout(() => {
        tabRefs.current[index]?.measure((x, y, width, height, pageX, pageY) => {
          const availableWidth = screenWidth;
          const scrollViewCenter = availableWidth / 2;
          const tabCenter = x + width / 2;
          const targetScrollX = tabCenter - scrollViewCenter;

          scrollViewRef.current?.scrollTo({
            x: Math.max(0, targetScrollX),
            animated: true,
          });
        });
      }, 100);
    }
  };

  const renderTabButton = (tab, index) => {
    // So sánh với activeTabIndex (props) hoặc activeTab (state) đều được vì đã sync
    const isActive = activeTab === index;

    return (
      <TouchableOpacity
        key={`tab-${index}`}
        ref={ref => (tabRefs.current[index] = ref)}
        style={[
          styles.tabButton,
          tabStyle,
          isActive && styles.activeTabButton,
          isActive && activeTabStyle,
        ]}
        onPress={() => handleTabPress(index)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.tabText,
            tabTextStyle,
            isActive && styles.activeTabText,
            isActive && activeTabTextStyle,
          ]}>
          {typeof tab === 'string' ? tab : tab.title || ''}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    // Bỏ Animated.View, chỉ dùng View thường
    <View style={[styles.container, containerStyle]}>
      <View style={styles.headerWrapper}>
        <View style={styles.tabHeaderContainer}>
          <ScrollView
            ref={Platform.OS === 'ios' ? scrollViewRef : null}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.tabScrollContent, scrollViewStyle]}
            style={styles.tabScrollView}
            bounces={false}>
            {tabs.map((tab, index) => renderTabButton(tab, index))}
          </ScrollView>
        </View>
      </View>

      {/* Đã xóa renderContent() vì content nằm ở HomeScreen/ListTinTuc */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red', // Xóa màu test
    // flex: 1, // Không để flex 1 vì nó chỉ là cái Header
    width: '100%',
    backgroundColor: '#fff',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e5e9',
    shadowColor: 'gray',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    height: 50, // Chiều cao cố định cho thanh Tab
  },
  tabHeaderContainer: {
    flex: 1,
  },
  tabScrollView: {
    flexGrow: 0,
  },
  tabScrollContent: {
    alignItems: 'center',
    paddingRight: 20, // Thêm padding phải để dễ bấm tab cuối
  },
  tabButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    backgroundColor: '#E8E8E8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20, // Bo tròn kiểu Pill
  },
  activeTabButton: {
    backgroundColor: '#00875A',
    shadowColor: '#00875A',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default PillTabView;
