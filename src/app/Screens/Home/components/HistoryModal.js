import React from 'react';
import {View, Text, TouchableOpacity, Modal, ScrollView, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';
import {useTranslation} from '../hooks/useTranslation';

export const HistoryModal = ({
  visible,
  onClose,
  history,
  onClearAll,
  onViewItem,
  onDeleteItem,
  onImagePress,
  language = 'vi',
}) => {
  const {t} = useTranslation(language);
  const diseaseTranslations = require('../diseaseTranslations.json');

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.historyModalContainer}>
        <TouchableOpacity
          style={styles.historyModalOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.historyModalContent}>
          <View style={styles.historyModalHeader}>
            <Text style={styles.historyModalTitle}>{t.history.title}</Text>
            <View style={{flexDirection: 'row', gap: 8}}>
              {history.length > 0 && (
                <TouchableOpacity
                  onPress={onClearAll}
                  style={styles.clearHistoryButton}>
                  <Icon name="delete" size={20} color="#f44336" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={onClose}
                style={styles.historyModalCloseButton}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {history.length === 0 ? (
            <View style={styles.emptyHistoryContainer}>
              <Icon name="history" size={64} color="#ccc" />
              <Text style={styles.emptyHistoryText}>
                {t.history.empty}
              </Text>
              <Text style={styles.emptyHistorySubtext}>
                {t.history.emptyDesc}
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.historyList}
              showsVerticalScrollIndicator={false}>
              {history.map(item => {
                // Re-translate diagnosis based on current language
                const originalLabel = item.result.originalDiagnosis || item.result.diagnosis;
                const translatedDiagnosis = diseaseTranslations[originalLabel]?.[language] || item.result.diagnosis;
                
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.historyItem}
                    onPress={() => onViewItem(item)}>
                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation();
                        onImagePress(item.image.uri);
                      }}>
                      <Image
                        source={{uri: item.image.uri}}
                        style={styles.historyItemImage}
                      />
                    </TouchableOpacity>
                    <View style={styles.historyItemContent}>
                      <Text style={styles.historyItemDiagnosis}>
                        {translatedDiagnosis}
                      </Text>
                      <Text style={styles.historyItemDate}>
                        {new Date(item.timestamp).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                      <View style={styles.historyItemConfidence}>
                        <Icon name="check-circle" size={14} color="#4CAF50" />
                        <Text style={styles.historyItemConfidenceText}>
                          {item.result.confidence}% {t.history.confidence}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.deleteHistoryItemButton}
                      onPress={e => {
                        e.stopPropagation();
                        onDeleteItem(item.id);
                      }}>
                      <Icon name="close-circle" size={24} color="#f44336" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};
