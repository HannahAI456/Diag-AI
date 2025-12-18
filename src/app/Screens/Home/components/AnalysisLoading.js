import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {styles} from '../styles';
import {AppColors} from '../../../Common/AppColor';

export const AnalysisLoading = () => {
  return (
    <View style={styles.loadingSection}>
      <ActivityIndicator size="large" color={AppColors.MainColor} />
      <Text style={styles.loadingText}>Đang phân tích hình ảnh...</Text>
      <Text style={styles.loadingSubtext}>Vui lòng đợi trong giây lát</Text>
    </View>
  );
};
