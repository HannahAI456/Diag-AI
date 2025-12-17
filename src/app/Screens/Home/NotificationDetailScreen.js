import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import TopNavigation from '../../Components/TopNavigation';
import Global from '../../LocalData/Global';
import {RootNavigation} from '../../Common/RootNavigation';
import { useGlobalModal } from '../../Common/GlobalModalContext';

export default function NotificationDetailScreen({ route }) {
  const { showModal } = useGlobalModal();
  React.useEffect(() => {
    showModal('Nội dung thông báo');
  }, []);

  const { notification } = route.params || {};
  if (!notification) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Không tìm thấy thông báo</Text>
      </View>
    );
  }
  return (
    <>
      <TopNavigation title="Chi tiết thông báo" navigation={RootNavigation} />
      <View style={styles.container}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.time}>{notification.time}</Text>
        <Text style={styles.content}>{notification.content}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0984e3',
    marginBottom: 12,
  },
  time: {
    color: '#888',
    fontSize: 13,
    marginBottom: 18,
  },
  content: {
    fontSize: 16,
    color: '#222',
    lineHeight: 22,
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 16,
  },
});
