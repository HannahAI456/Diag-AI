import React from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {styles} from '../styles';
import {AppColors} from '../../../Common/AppColor';
import {useTranslation} from '../hooks/useTranslation';

export const AnalysisLoading = ({language = 'vi'}) => {
  const {t} = useTranslation(language);

  return (
    <View style={styles.loadingSection}>
      <ActivityIndicator size="large" color={AppColors.MainColor} />
      <Text style={styles.loadingText}>{t.loading.analyzing}</Text>
      <Text style={styles.loadingSubtext}>{t.loading.pleaseWait}</Text>
    </View>
  );
};
