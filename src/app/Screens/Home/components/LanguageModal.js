import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';

const languages = [
  {code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳'},
  {code: 'en', name: 'English', flag: '🇬🇧'},
  // Có thể thêm các ngôn ngữ khác ở đây
//   {code: 'zh', name: '中文', flag: '🇨🇳'},
  // {code: 'ja', name: '日本語', flag: '🇯🇵'},
  // {code: 'ko', name: '한국어', flag: '🇰🇷'},
];

export const LanguageModal = ({visible, onClose, currentLanguage, onSelectLanguage}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.languageModalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <View style={styles.languageModalContent}>
          <View style={styles.languageModalHeader}>
            <Text style={styles.languageModalTitle}>
              Chọn ngôn ngữ
            </Text>
          </View>
          
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                currentLanguage === lang.code && styles.languageOptionActive,
              ]}
              onPress={() => {
                onSelectLanguage(lang.code);
                onClose();
              }}>
              <Text style={styles.languageFlag}>{lang.flag}</Text>
              <Text style={[
                styles.languageName,
                currentLanguage === lang.code && styles.languageNameActive,
              ]}>
                {lang.name}
              </Text>
              {currentLanguage === lang.code && (
                <Icon name="check-circle" size={20} color="#1565C0" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
