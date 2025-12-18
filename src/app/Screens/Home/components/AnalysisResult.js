import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';
import {AppColors} from '../../../Common/AppColor';
import {useTranslation} from '../hooks/useTranslation';

export const AnalysisResult = ({
  imageUri,
  result,
  onReset,
  onShare,
  onImagePress,
  language = 'vi',
}) => {
  const {t} = useTranslation(language);

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
          <Text style={styles.diagnosisLabel}>{t.result.diagnosis}</Text>
          <Text style={styles.diagnosisText}>{result.diagnosis}</Text>
          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>{t.result.confidence}</Text>
            <Text style={styles.confidenceValue}>{result.confidence}%</Text>
          </View>
        </View>

        {/* All Predictions */}
        {result.predictions && result.predictions.length > 0 && (
          <View style={styles.predictionsContainer}>
            <Text style={styles.predictionsLabel}>
              {language === 'vi' ? 'Kết quả:' : 'Other Results:'}
            </Text>
            {result.predictions.map((pred, index) => (
              <View key={index} style={styles.predictionItem}>
                <Text style={styles.predictionLabel}>{pred.label}</Text>
                <Text style={styles.predictionConfidence}>{pred.confidence}%</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onReset}>
          <Icon name="refresh" size={20} color="#666" />
          <Text style={styles.secondaryButtonText}>{t.result.newCheck}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={onShare}>
          <Icon name="share-variant" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>{t.result.share}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.disclaimerContainer}>
        <Icon name="information" size={20} color="#FF9800" />
        <Text style={styles.disclaimerText}>
          {t.result.disclaimer}
        </Text>
      </View>
    </View>
  );
};
