import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';
import {AppColors} from '../../../Common/AppColor';
import {useTranslation} from '../hooks/useTranslation';

export const HeroSection = ({
  onGallery,
  onCamera,
  recentResults,
  onViewResult,
  onViewAllHistory,
  language,
}) => {
  const {t} = useTranslation(language);
  const diseaseTranslations = require('../diseaseTranslations.json');
  
  console.log('Recent Results in HeroSection:', recentResults);
  return (
    <>
      <View style={styles.heroSection}>
        {/* Logo Heart with Hands */}
        <View style={styles.logoContainer}>
          <Image source={require('../../../../asset/Icons/main.png')} style={styles.logoImage} />
        </View>

        <Text style={styles.heroTitle}>{t.hero.title}</Text>
        <Text style={styles.heroSubtitle}>{t.hero.subtitle}</Text>
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionButtonsRow}>
        {/* Gallery Button */}
        <TouchableOpacity style={styles.actionButtonHalf} onPress={onGallery}>
          <Icon name="image-outline" size={28} color={"#1565C0"} />
          <Text style={styles.actionButtonTextSmall}>
            {t.hero.galleryButton}
          </Text>
        </TouchableOpacity>

        {/* Camera Button */}
        <TouchableOpacity style={styles.actionButtonHalf} onPress={onCamera}>
          <Icon name="camera-outline" size={28} color={"#1565C0"} />
          <Text style={styles.actionButtonTextSmall}>
            {t.hero.cameraButton}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Latest Results Section */}
      {recentResults && recentResults.length > 0 && (
        <View style={styles.latestResultSection}>
          <View style={styles.latestResultHeader}>
            <Text style={styles.latestResultTitle}>{t.hero.recentResults}</Text>
            {recentResults.length > 3 && (
              <TouchableOpacity onPress={onViewAllHistory}>
                <Text style={styles.viewMoreText}>{t.hero.viewMore}</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentResults.slice(0, 3).map((item, index) => {
            // Re-translate diagnosis based on current language
            const originalLabel = item.result.originalDiagnosis || item.result.diagnosis;
            const translatedDiagnosis = diseaseTranslations[originalLabel]?.[language] || item.result.diagnosis;
            
            return (
              <TouchableOpacity
                key={index}
                style={styles.latestResultCard}
                onPress={() => onViewResult(item)}>
                <Image
                  source={{uri: item.image.uri}}
                  style={styles.latestResultImage}
                />
                <View style={styles.latestResultInfo}>
                  <Text style={styles.latestResultLabel}>
                    {translatedDiagnosis}
                  </Text>
                  <Text style={styles.latestResultConfidence}>
                    {t.hero.confidence}: {item.result.confidence}%
                  </Text>
                </View>
                <Icon name="chevron-right" size={24} color="#999" />
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </>
  );
};
