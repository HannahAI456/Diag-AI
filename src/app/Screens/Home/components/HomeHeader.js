import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';
import {AppColors} from '../../../Common/AppColor';
import {useTranslation} from '../hooks/useTranslation';
import {LanguageModal} from './LanguageModal';

export const HomeHeader = ({
  historyCount,
  onHistoryPress,
  onNotificationPress,
  language = 'vi',
  onLanguagePress,
}) => {
  const {t} = useTranslation(language);
  const [showLanguageModal, setShowLanguageModal] = React.useState(false);
  
  return (
    <>
      <LanguageModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        currentLanguage={language}
        onSelectLanguage={onLanguagePress}
      />
    <View style={styles.headerContainer}>
      <View style={styles.headerLeft}>
        <TouchableOpacity
          style={styles.languageSelector}
          onPress={() => setShowLanguageModal(true)}>
          <Text style={styles.languageText}>
            {language === 'vi' ? '🇻🇳 Tiếng Việt' : '🇬🇧 English'}
          </Text>
          <Icon name="chevron-down" size={16} color="#666" />
        </TouchableOpacity>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={[styles.btnHeader, {marginLeft: 12}]}
          onPress={onHistoryPress}>
          <Icon name="history" size={24} color="gray" />
          {historyCount > 0 && (
            <View style={styles.historyBadge}>
              <Text style={styles.historyBadgeText}>{historyCount}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btnHeader, {marginLeft: 8}]}
          onPress={onNotificationPress}>
          <Icon name="bell" size={24} color="gray" />
        </TouchableOpacity>
      </View>
    </View>
    </>
  );
};
