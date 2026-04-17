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
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import ProfileScreen from './ProfileScreen';
import HomeScreen from './HomeScreen';
import Global from '../../LocalData/Global';
// import DemoScreen from './Demo';
import DemoScreen from '../DemoScreen/DemoScreen';

const AnimatedTabIcon = ({focused, icon, label, image}) => {
  const isAndroid = Platform.OS === 'android';
  const animatedValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;
  const translateYValue = useRef(new Animated.Value(0)).current;
  const shadowAnimValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      Animated.parallel([
        Animated.spring(animatedValue, {
          toValue: 1,
          friction: 5,
          useNativeDriver: false,
        }),
        Animated.spring(scaleValue, {
          toValue: 1.05,
          friction: 5,
          useNativeDriver: false,
        }),
        Animated.spring(translateYValue, {
          toValue: -5,
          friction: 5,
          useNativeDriver: false,
        }),
        Animated.timing(shadowAnimValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(translateYValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(shadowAnimValue, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]).start();
    }
  }, [focused]);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(192, 215, 205, 0.14)', 'rgba(75, 199, 137, 0.14)'],
  });

  const shadowOpacity = shadowAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.15],
  });

  const shadowRadius = shadowAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 6],
  });

  const elevation = shadowAnimValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  return (
    <Animated.View
      style={[
        styles.tabIconContainer,
        {
          backgroundColor,
          transform: [{translateY: translateYValue}, {scale: scaleValue}],
          ...(isAndroid
            ? {shadowOpacity: 0, shadowRadius: 0, elevation: 0}
            : {shadowOpacity, shadowRadius, elevation}),
        },
      ]}>
      {image ? (
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
          <View style={styles.iconInactiveContainer}>
            <Image
              source={{uri: Global.AssetLinkUrl + image}}
              style={styles.tabImageInactive}
              resizeMode="contain"
            />
          </View>
        )
      ) : focused ? (
        <LinearGradient
          colors={['#216f67', '#31a86f']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.iconGradientContainer}>
          <Icon name={icon} size={18} color="#fff" />
        </LinearGradient>
      ) : (
        <View style={styles.iconInactiveContainer}>
          <Icon name={icon} size={18} color={styles.iconInactiveColor.color} />
        </View>
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
        name="Đóng góp"
        component={HomeScreen}
        initialParams={{data: {DongGop: true}}}
        options={{
          tabBarLabel: 'Đóng góp',
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon
              focused={focused}
              icon={'heart'}
              label={'Đóng góp'}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Thông tin',
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon focused={focused} icon="info" label="Thông tin" />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Demo"
        component={DemoScreen}
        options={{
          tabBarLabel: 'Thông tin',
          tabBarIcon: ({focused}) => (
            <AnimatedTabIcon focused={focused} icon="info" label="Thông tin" />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  customTabBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
    }),
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
    height: 50,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    minWidth: 50,
    ...Platform.select({
      ios: {
        shadowColor: '#31a86f',
        shadowOffset: {width: 0, height: 2},
      },
      android: {
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
    }),
  },
  iconGradientContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#31a86f',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
    }),
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 3,
    color: '#31a86f',
  },
  tabLabelInactive: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 3,
    color: 'rgba(33, 111, 103, 0.55)',
    letterSpacing: 0.2,
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
  iconInactiveContainer: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(182, 215, 199, 0.08)',
    // borderWidth: 1,
    // borderColor: 'rgba(49, 168, 111, 0.18)',
  },
  iconInactiveColor: {
    color: 'rgba(33, 111, 103, 0.65)',
  },
});
