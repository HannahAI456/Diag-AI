import React from 'react';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';
import {useTranslation} from '../hooks/useTranslation';

export const ImagePreview = ({imageUri, onCancel, onAnalyze, onImagePress, language = 'vi'}) => {
  const {t} = useTranslation(language);

  return (
    <View style={styles.previewSection}>
      <TouchableOpacity onPress={onImagePress}>
        <Image
          source={{uri: imageUri}}
          style={styles.previewImage}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.previewActions}>
        <TouchableOpacity style={styles.secondaryButton} onPress={onCancel}>
          <Icon name="close" size={20} color="#666" />
          <Text style={styles.secondaryButtonText}>{t.imagePreview.cancel}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryButton} onPress={onAnalyze}>
          <Icon name="brain" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>{t.imagePreview.analyze}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
