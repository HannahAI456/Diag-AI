import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const DownloadButton = ({ onDownload }) => (
  <TouchableOpacity style={styles.button} onPress={onDownload}>
    <Text style={styles.text}>Download</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { backgroundColor: '#27ae60', padding: 12, borderRadius: 6, alignItems: 'center', marginVertical: 8 },
  text: { color: '#fff', fontWeight: 'bold' },
});

export default DownloadButton;
