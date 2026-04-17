import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Toast from 'react-native-toast-message';
import {styles} from '../styles';
import {AppColors} from '../../../Common/AppColor';
import {useTranslation} from '../hooks/useTranslation';

export const AnalysisResult = ({
  imageUri,
  result,
  onReset,
  onShare,
  onImagePress,
  onFeedback,
  showFeedback = false,
  language = 'vi',
}) => {
  const {t} = useTranslation(language);
  const [feedbackGiven, setFeedbackGiven] = React.useState(false);
  const [selectedFeedback, setSelectedFeedback] = React.useState(null);
  const [selectedCorrection, setSelectedCorrection] = React.useState(null);

  // Safety check to prevent null reference errors
  if (!imageUri || !result) {
    return null;
  }

  const correctionOptions = [
    {
      id: 'hand_foot_mouth',
      label:
        language === 'vi'
          ? 'Bệnh tay chân miệng'
          : 'Hand, Foot and Mouth Disease',
    },
    {
      id: 'skin_disease',
      label:
        language === 'vi'
          ? 'Bệnh da liễu ngoài tay chân miệng'
          : 'Skin Disease (not Hand, Foot and Mouth)',
    },
    {
      id: 'healthy',
      label: language === 'vi' ? 'Khỏe mạnh' : 'Healthy',
    },
  ];

  const handleFeedback = isAccurate => {
    setSelectedFeedback(isAccurate);
    if (isAccurate) {
      setFeedbackGiven(true);
      if (onFeedback) {
        onFeedback(isAccurate, null);
      }
    } else {
      // Don't mark as given yet, wait for correction selection and submit
      setSelectedCorrection(null);
    }
  };

  const handleCorrectionSelect = correctionId => {
    setSelectedCorrection(correctionId);
  };

  const handleSubmitCorrection = () => {
    if (selectedCorrection) {
      // Mark feedback as given first to update UI immediately
      setFeedbackGiven(true);
      
      // Save to storage and call callback
      if (onFeedback) {
        onFeedback(false, selectedCorrection);
      }

      // Show toast message
      Toast.show({
        type: 'success',
        text1: language === 'vi' ? 'Cảm ơn bạn!' : 'Thank you!',
        text2:
          language === 'vi'
            ? 'Phản hồi của bạn đã được ghi nhận'
            : 'Your feedback has been recorded',
        position: 'top',
        visibilityTime: 2500,
        topOffset: 60,
      });

      // Reset states and call onReset after toast finishes
      setTimeout(() => {
        // Call reset to go back to initial state
        if (onReset) {
          onReset();
        }
      }, 2600);
    }
  };

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
                <Text style={styles.predictionConfidence}>
                  {pred.confidence}%
                </Text>
              </View>
            ))}
          </View>
        )}
        {showFeedback && (
          <View style={styles.feedbackContainer}>
            <View style={styles.feedbackHeader}>
            <View style={styles.feedbackIconWrapper}>
              <Icon name="comment-question-outline" size={20} color="#1565C0" />
            </View>
            <Text style={styles.feedbackQuestion}>
              {language === 'vi'
                ? 'Kết quả này có chính xác không?'
                : 'Is this result accurate?'}
            </Text>
          </View>
          <View style={styles.feedbackButtons}>
            <TouchableOpacity
              style={[
                styles.feedbackButton,
                selectedFeedback === false &&
                  styles.feedbackButtonSelectedNegative,
                feedbackGiven &&
                  selectedFeedback !== false &&
                  styles.feedbackButtonDisabled,
              ]}
              onPress={() => handleFeedback(false)}
              disabled={feedbackGiven}>
              <Icon
                name={
                  selectedFeedback === false
                    ? 'close-circle'
                    : 'close-circle-outline'
                }
                size={24}
                color={
                  selectedFeedback === false
                    ? '#F44336'
                    : feedbackGiven
                    ? '#ccc'
                    : '#F44336'
                }
              />
              <Text
                style={[
                  styles.feedbackButtonText,
                  selectedFeedback === false &&
                    styles.feedbackButtonTextSelectedNegative,
                  feedbackGiven &&
                    selectedFeedback !== false &&
                    styles.feedbackButtonTextDisabled,
                ]}>
                {language === 'vi' ? 'Không chính xác' : 'Not Accurate'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.feedbackButton,
                selectedFeedback === true && styles.feedbackButtonSelected,
                feedbackGiven &&
                  selectedFeedback !== true &&
                  styles.feedbackButtonDisabled,
              ]}
              onPress={() => handleFeedback(true)}
              disabled={feedbackGiven}>
              <Icon
                name={
                  selectedFeedback === true
                    ? 'check-circle'
                    : 'check-circle-outline'
                }
                size={24}
                color={
                  selectedFeedback === true
                    ? '#4CAF50'
                    : feedbackGiven
                    ? '#ccc'
                    : '#4CAF50'
                }
              />
              <Text
                style={[
                  styles.feedbackButtonText,
                  selectedFeedback === true &&
                    styles.feedbackButtonTextSelected,
                  feedbackGiven &&
                    selectedFeedback !== true &&
                    styles.feedbackButtonTextDisabled,
                ]}>
                {language === 'vi' ? 'Chính xác' : 'Accurate'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Correction Options - Show when "Not Accurate" is selected */}
          {selectedFeedback === false && !feedbackGiven && (
            <View style={styles.correctionContainer}>
              <Text style={styles.correctionTitle}>
                {language === 'vi'
                  ? 'Vui lòng chọn kết quả chính xác:'
                  : 'Please select the correct result:'}
              </Text>
              {correctionOptions.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={styles.correctionOption}
                  onPress={() => handleCorrectionSelect(option.id)}>
                  <Icon
                    name={
                      selectedCorrection === option.id
                        ? 'checkbox-marked'
                        : 'checkbox-blank-outline'
                    }
                    size={24}
                    color={
                      selectedCorrection === option.id ? '#1565C0' : '#999'
                    }
                  />
                  <Text
                    style={[
                      styles.correctionLabel,
                      selectedCorrection === option.id &&
                        styles.correctionLabelSelected,
                    ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {feedbackGiven && (
            <View style={styles.feedbackThankYouContainer}>
              <Icon name="check-circle" size={18} color="#4CAF50" />
              <Text style={styles.feedbackThankYou}>
                {language === 'vi'
                  ? 'Cảm ơn bạn đã đóng góp ý kiến'
                  : 'Thank you for your feedback'}
              </Text>
            </View>
          )}
          </View>
        )}
      </View>

      <View style={styles.resultActions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onReset}>
          <Icon name="refresh" size={20} color="#666" />
          <Text style={styles.secondaryButtonText}>{t.result.newCheck}</Text>
        </TouchableOpacity>

        {/* Submit Button - Only show when "Not Accurate" is selected and correction is chosen */}
        {selectedFeedback === false && !feedbackGiven && selectedCorrection && (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitCorrection}>
            <Icon name="send" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>
              {language === 'vi' ? 'Gửi' : 'Submit'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.disclaimerContainer}>
        <Icon name="information" size={20} color="#FF9800" />
        <Text style={styles.disclaimerText}>{t.result.disclaimer}</Text>
      </View>
    </View>
  );
};
