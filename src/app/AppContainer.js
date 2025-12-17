import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GlobalModalProvider} from './Common/GlobalModalContext';
import GlobalModal from './Common/GlobalModal';
import {RecoilRoot} from 'recoil';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createSharedElementStackNavigator} from 'react-navigation-shared-element';
import Splash from './Screens/Splash/Splash';
import {RootNavigation} from './Common/RootNavigation';
import TabNavigation from './Screens/Home/TabNavigation';
import NotificationDetailScreen from './Screens/Home/NotificationDetailScreen';
import HomeScreen from './Screens/Home/HomeScreen';
import NotificationScreen from './Screens/Home/NotificationScreen';
import ProfileScreen from './Screens/Home/ProfileScreen';
import LoginScreen from './Screens/Login/LoginScreen';
import WebViewDungChung from './Screens/WebViewDungChung/WebViewDungChung';

const AppContainer = () => {
  const [visible, setVisible] = React.useState(false);
  const AppStack = () => {
    const MainStack = createSharedElementStackNavigator();
    return (
      <MainStack.Navigator
        detachInactiveScreens={false}
        screenOptions={{
          headerShown: false,
        }}>
        <MainStack.Screen name="Home" component={TabNavigation} />
        <MainStack.Screen
          name="NotificationDetail"
          component={NotificationDetailScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="HomeScreen"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="ProfileScreen"
          component={ProfileScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="WebviewDungChung"
          component={WebViewDungChung}
          options={{headerShown: false}}
        />
      </MainStack.Navigator>
    );
  };
  const SplashScreen = setVisible => {
    const SplashStack = createNativeStackNavigator();
    return (
      <SplashStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <SplashStack.Screen
          name="splash"
          children={props => {
            return <Splash {...props} setVisible={setVisible}></Splash>;
          }}
        />
      </SplashStack.Navigator>
    );
  };

  return (
    <GlobalModalProvider>
      <RecoilRoot>
        <NavigationContainer ref={RootNavigation}>
          {visible ? AppStack() : SplashScreen(setVisible)}
          <GlobalModal />
        </NavigationContainer>
      </RecoilRoot>
    </GlobalModalProvider>
  );
};

export default AppContainer;
