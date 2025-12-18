import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';
import {useTranslation} from '../hooks/useTranslation';

export const BottomNavigation = ({activeTab, onTabChange, language}) => {
  const {t} = useTranslation(language);
  
  return (
    <View style={styles.bottomNavContainer}>
      <TouchableOpacity
        style={styles.bottomNavTab}
        onPress={() => onTabChange('home')}>
        <Icon
          name="home"
          size={26}
          color={activeTab === 'home' ? '#fff' : 'rgba(255, 255, 255, 0.6)'}
        />
        <Text
          style={[
            styles.bottomNavText,
            activeTab === 'home' && styles.bottomNavTextActive,
          ]}>
          {t.bottomNav.home}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.bottomNavTab}
        onPress={() => onTabChange('info')}>
        <Icon
          name="information"
          size={26}
          color={activeTab === 'info' ? '#fff' : 'rgba(255, 255, 255, 0.6)'}
        />
        <Text
          style={[
            styles.bottomNavText,
            activeTab === 'info' && styles.bottomNavTextActive,
          ]}>
          {t.bottomNav.info}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
