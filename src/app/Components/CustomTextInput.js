import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

/**
 * Props:
 * - value: string
 * - onChangeText: (text: string) => void
 * - placeholder?: string
 * - isSearch?: boolean (if true, show search icon and clear button)
 * - style?: any (custom style for container)
 * - inputStyle?: any (custom style for TextInput)
 * - onSearch?: () => void (optional, called when search icon pressed)
 */
const CustomTextInput = ({
  value,
  onChangeText,
  placeholder = '',
  isSearch = false,
  style = {},
  inputStyle = {},
  onSearch,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      {isSearch && (
        <TouchableOpacity onPress={onSearch} style={styles.iconLeft}>
          <Icon name="search" size={20} color="#888" />
        </TouchableOpacity>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={[styles.input, inputStyle, isSearch && { paddingLeft: 36 }]}
        {...rest}
      />
      {isSearch && value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText('')} style={styles.iconRight}>
          <Icon name="close-circle" size={20} color="#888" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 0,
  },
  iconLeft: {
    position: 'absolute',
    left: 8,
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: 8,
    zIndex: 1,
  },
});

export default CustomTextInput;
