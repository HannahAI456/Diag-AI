import React from 'react';
import {View, Button, StyleSheet} from 'react-native';
import notifee from '@notifee/react-native';

const PushNotificationButton = () => {
  const requestPermission = async () => {
    await notifee.requestPermission();
  };

  const onDisplayNotification = async () => {
    await requestPermission();
    await notifee.displayNotification({
      title: 'Hello! 👋',
      body: 'This is a test push notification.',
      android: {
        channelId: 'default',
        smallIcon: 'ic_launcher',
      },
    });
  };

  React.useEffect(() => {
    notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });
  }, []);

  return (
    <View style={styles.container}>
      <Button title="Push Notify" onPress={onDisplayNotification} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PushNotificationButton;
