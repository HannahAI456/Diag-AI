import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';
import {AppColors} from '../../../Common/AppColor';

export const AnalysisResult = ({
  imageUri,
  result,
  onReset,
  onShare,
  onImagePress,
  language = 'vi',
}) => {
  const translations = {
    vi: {
      diagnosis: 'Chẩn đoán:',
      confidence: 'Độ tin cậy:',
      description: 'Mô tả:',
      recommendations: 'Khuyến nghị:',
      newCheck: 'Kiểm tra mới',
      share: 'Chia sẻ',
      disclaimer: 'Kết quả chỉ mang tính chất tham khảo. Vui lòng gặp bác sĩ để được tư vấn chính xác.',
    },
    en: {
      diagnosis: 'Diagnosis:',
      confidence: 'Confidence:',
      description: 'Description:',
      recommendations: 'Recommendations:',
      newCheck: 'New Check',
      share: 'Share',
      disclaimer: 'Results are for reference only. Please consult a doctor for accurate advice.',
    },
  };

  const t = translations[language];

  return (
    <View style={styles.resultSection}>
      <View style={styles.resultCard}>
        <View style={styles.resultImageContainer}>
          <TouchableOpacity onPress={onImagePress}>
            <Image
              source={{uri: imageUri}}
              style={styles.resultImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.diagnosisContainer}>
          <Text style={styles.diagnosisLabel}>{t.diagnosis}</Text>
          <Text style={styles.diagnosisText}>{result.diagnosis}</Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>{t.confidence}</Text>
            <Text style={styles.confidenceValue}>{result.confidence}%</Text>
          </View>
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>{t.description}</Text>
          <Text style={styles.descriptionText}>{result.description}</Text>
        </View>

        <View style={styles.recommendationsContainer}>
          <Text style={styles.recommendationsLabel}>{t.recommendations}</Text>
          {result.recommendations.map((rec, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Icon name="check" size={18} color={AppColors.MainColor} />
              <Text style={styles.recommendationText}>{rec}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onReset}>
          <Icon name="refresh" size={20} color="#666" />
          <Text style={styles.secondaryButtonText}>{t.newCheck}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={onShare}>
          <Icon name="share-variant" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>{t.share}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.disclaimerContainer}>
        <Icon name="information" size={20} color="#FF9800" />
        <Text style={styles.disclaimerText}>
          {t.disclaimer}
        </Text>
      </View>
    </View>
  );
};
