import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const Checkbox = ({label, checked, onChange, style, labelStyle, disabled}) => {
  return (
    <View style={[styles.container, style, disabled && styles.disabled]}>
      <CheckBox
        value={checked}
        onValueChange={onChange}
        disabled={disabled}
        tintColors={{true: '#007AFF', false: '#ccc'}}
        style={styles.checkbox}
      />
      {label ? (
        <Text style={[styles.label, labelStyle, disabled && styles.disabledLabel]}>
          {label}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: '#222',
  },
  disabled: {
    opacity: 0.5,
  },
  disabledBox: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ccc',
  },
  disabledLabel: {
    color: '#aaa',
  },
});

export default Checkbox;
