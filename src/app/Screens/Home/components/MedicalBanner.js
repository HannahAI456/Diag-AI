import React from 'react';
import {View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';

export const MedicalBanner = () => {
  return (
    <View
      style={[
        styles.medicalBannerContainer,
        {
          backgroundColor: '#1565C0',
          paddingVertical: 16,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        },
      ]}>
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Icon name="heart-pulse" size={28} color="#fff" />
      </View>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#fff',
            marginBottom: 2,
          }}>
          Kiểm tra sức khỏe da
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.9)',
          }}>
          Phát hiện sớm, chăm sóc tốt
        </Text>
      </View>
      <Icon name="chevron-right" size={24} color="rgba(255, 255, 255, 0.7)" />
    </View>
  );
};
