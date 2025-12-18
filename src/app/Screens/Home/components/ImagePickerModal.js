import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';

export const ImagePickerModal = ({visible, onClose, onCamera, onGallery}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.imagePickerModalContainer}>
        <TouchableOpacity
          style={styles.imagePickerModalOverlay}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.imagePickerModalContent}>
          <View style={styles.imagePickerModalHeader}>
            <Text style={styles.imagePickerModalTitle}>Chọn hình ảnh</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.imagePickerModalCloseButton}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.imagePickerOption} onPress={onCamera}>
            <View
              style={[
                styles.imagePickerOptionIcon,
                {backgroundColor: '#E3F2FD'},
              ]}>
              <Icon name="camera" size={28} color="#2196F3" />
            </View>
            <View style={styles.imagePickerOptionContent}>
              <Text style={styles.imagePickerOptionTitle}>Chụp ảnh</Text>
              <Text style={styles.imagePickerOptionDescription}>
                Mở camera để chụp ảnh mới và chỉnh sửa
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.imagePickerOption} onPress={onGallery}>
            <View
              style={[
                styles.imagePickerOptionIcon,
                {backgroundColor: '#F3E5F5'},
              ]}>
              <Icon name="image-multiple" size={28} color="#9C27B0" />
            </View>
            <View style={styles.imagePickerOptionContent}>
              <Text style={styles.imagePickerOptionTitle}>
                Chọn từ thư viện
              </Text>
              <Text style={styles.imagePickerOptionDescription}>
                Chọn ảnh có sẵn và chỉnh sửa, cắt theo ý muốn
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
