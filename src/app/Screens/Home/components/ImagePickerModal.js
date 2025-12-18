import React from 'react';
import {View, Text, TouchableOpacity, Modal} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {styles} from '../styles';
import {useTranslation} from '../hooks/useTranslation';

export const ImagePickerModal = ({visible, onClose, onCamera, onGallery, language = 'vi'}) => {
  const {t} = useTranslation(language);

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
            <Text style={styles.imagePickerModalTitle}>{t.imagePicker.title}</Text>
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
              <Text style={styles.imagePickerOptionTitle}>{t.imagePicker.camera}</Text>
              <Text style={styles.imagePickerOptionDescription}>
                {t.imagePicker.cameraDesc}
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
                {t.imagePicker.gallery}
              </Text>
              <Text style={styles.imagePickerOptionDescription}>
                {t.imagePicker.galleryDesc}
              </Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
