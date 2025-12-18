import React from 'react';
import {View, Text, TouchableOpacity, Modal, ScrollView, Image} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';

export const HistoryModal = ({
  visible,
  onClose,
  history,
  onClearAll,
  onViewItem,
  onDeleteItem,
  onImagePress,
}) => {
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
            <Text style={styles.historyModalTitle}>Lịch sử kiểm tra</Text>
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
                Chưa có lịch sử kiểm tra
              </Text>
              <Text style={styles.emptyHistorySubtext}>
                Các kết quả phân tích sẽ được lưu tại đây
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.historyList}
              showsVerticalScrollIndicator={false}>
              {history.map(item => (
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
                      {item.result.diagnosis}
                    </Text>
                    <Text style={styles.historyItemDate}>
                      {new Date(item.timestamp).toLocaleString('vi-VN', {
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
                        {item.result.confidence}% độ tin cậy
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
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};
