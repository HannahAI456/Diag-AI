import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalModal } from './GlobalModalContext';

const GlobalModal = () => {
  const { modalVisible, modalContent, hideModal } = useGlobalModal();

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={hideModal}
    >
      <View style={styles.overlay}>
        <View style={styles.modalBox}>
          {typeof modalContent === 'string' ? (
            <Text style={styles.text}>{modalContent}</Text>
          ) : (
            modalContent
          )}
          <TouchableOpacity style={styles.button} onPress={hideModal}>
            <Text style={styles.buttonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    minWidth: 250,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GlobalModal;
