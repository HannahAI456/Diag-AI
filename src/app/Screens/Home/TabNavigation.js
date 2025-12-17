import * as React from 'react';
import {useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import {useRecoilValue} from 'recoil';
import {menuState} from '../../Common/authAtom';

// Import your screens
import HomeSrceen from './Demo';
import LoginScreen from '../Login/LoginScreen';
import NotificationScreen from './NotificationScreen';
import ProfileScreen from './ProfileScreen';
import ExploreScreen from './ExploreScreen';
import DemoScreen from './Demo';
import HomeScreen from './HomeScreen';
import BaoCao from '../BaoCao/BaoCao';
import Global from '../../LocalData/Global';
import BottomTabNavigator from '../../Navigation/BottomTabPhanAnhNavigator';
import PhanAnh from '../PhanAnh/PhanAnh';
import LinhVucNhomTin from '../LinhVucNhomTin/LinhVucNhomTin';
import BaoCaoNhomTin from '../BaoCaoNhomTin/BaoCaoNhomTin';
import DuLieuTab from './DuLieuTab/DuLieuTab';

const AnimatedTabIcon = ({focused, icon, label, image}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(animatedValue, {
          toValue: 1,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
          toValue: 1.05,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(translateYValue, {
          toValue: -5,
          friction: 5,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', 'rgba(102, 126, 234, 0.1)'],
  });

  return (
    <Animated.View
      style={[
        styles.tabIconContainer,
        {
          backgroundColor,
          transform: [{translateY: translateYValue}, {scale: scaleValue}],
        },
      ]}>
      {image ? (
        // Hiển thị hình ảnh nếu có
        focused ? (
          <LinearGradient
            colors={['#216f67', '#31a86f']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.iconGradientContainer}>
            <Image
              source={{uri: Global.AssetLinkUrl + image}}
              style={styles.tabImage}
              resizeMode="contain"
            />
          </LinearGradient>
        ) : (
          <Image
            source={{uri: Global.AssetLinkUrl + image}}
            style={styles.tabImageInactive}
            resizeMode="contain"
          />
        )
      ) : focused ? (
        // Hiển thị icon nếu không có image
        <LinearGradient
          colors={['#216f67', '#31a86f']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.iconGradientContainer}>
          <Icon name={icon} size={18} color="#fff" />
        </LinearGradient>
      ) : (
        <Icon name={icon} size={20} color="#95a5a6" />
      )}
      {focused ? (
        <Animated.Text style={[styles.tabLabel, {opacity: animatedValue}]}>
          {label}
        </Animated.Text>
      ) : (
        <Text style={styles.tabLabelInactive}>{label}</Text>
      )}
      {focused && (
        <Animated.View style={[styles.activeDot, {opacity: animatedValue}]} />
      )}
    </Animated.View>
  );
};

const CustomTabBar = ({state, descriptors, navigation}) => {
  // Ẩn tab bar nếu đang ở màn hình BottomTabNavigator
  const currentRoute = state.routes[state.index];
  if (currentRoute.name === 'BottomTabNavigator') {
    return null;
  }

  return (
    <View style={styles.customTabBar}>
      <LinearGradient
        colors={['rgba(255,255,255,0.98)', 'rgba(255,255,255,1)']}
        style={styles.tabBarGradient}>
        <View style={styles.tabBarContent}>
          {state.routes.map((route, index) => {
            const {options} = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? {selected: true} : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                style={styles.tabButton}>
                {options.tabBarIcon({focused: isFocused})}
              </TouchableOpacity>
            );
          })}
        </View>
      </LinearGradient>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      detachInactiveScreens={false}
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        freezeOnBlur: true,
        lazy: false,
        unmountOnBlur: false,
        tabBarStyle:
          route.name === 'BottomTabNavigator' ? {display: 'none'} : undefined,
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{data: []}}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              icon={'home'}
              label={'Trang chủ'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Tài khoản',
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon focused={focused} icon="user" label="Tài khoản" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  customTabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBarGradient: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: Platform.OS === 'ios' ? 15 : 8,
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  tabBarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 50, // Giảm chiều cao
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 50,
  },
  iconGradientContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#31a86f',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tabLabel: {
    fontSize: 10, // Giảm kích thước chữ
    fontWeight: '600',
    marginTop: 3,
    color: '#31a86f',
  },
  tabLabelInactive: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
    color: '#95a5a6',
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#31a86f',
  },
  tabImage: {
    width: 18,
    height: 18,
    tintColor: '#fff',
  },
  tabImageInactive: {
    width: 20,
    height: 20,
    tintColor: '#95a5a6',
  },
});
