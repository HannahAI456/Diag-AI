import React, {useState, useMemo} from 'react';
import CheckBox from '@react-native-community/checkbox';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  ScrollView,
} from 'react-native';

/**
 * MultiSelect component
 * Props:
 * - options: [{ label, value }]
 * - selected: array of values
 * - onChange: (array) => void
 * - placeholder: string
 * - searchPlaceholder: string
 * - modalTitle: string
 * - style, modalStyle, optionStyle, selectedStyle, ...
 */
const MultiSelect = ({
  options = [],
  selected = [],
  onChange,
  placeholder = 'Chọn...',
  searchPlaceholder = 'Tìm kiếm...',
  modalTitle = 'Chọn nhiều mục',
  style,
  modalStyle,
  optionStyle,
  selectedStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(opt =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, options]);

  const toggleSelect = value => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  // Checkbox component sử dụng @react-native-community/checkbox
  const MyCheckbox = ({checked, onValueChange, style, disabled}) => (
    <CheckBox
      // animationDuration={200}
      value={checked}
      onValueChange={onValueChange}
      disabled={disabled}
      tintColors={{true: '#007AFF', false: '#bbb'}}
      style={[styles.checkbox, style]}
    />
  );

  // Check all logic
  const allValues = options.map(opt => opt.value);
  const isAllChecked =
    allValues.length > 0 && allValues.every(v => selected.includes(v));
  const isIndeterminate = selected.length > 0 && !isAllChecked;

  const toggleSelectAll = () => {
    if (isAllChecked) {
      onChange([]);
    } else {
      onChange(allValues);
    }
  };

  const renderOption = ({item}) => (
    <View
      style={[
        styles.option,
        optionStyle,
        selected.includes(item.value) && [styles.selected, selectedStyle],
      ]}>
      <MyCheckbox
        checked={selected.includes(item.value)}
        onValueChange={() => toggleSelect(item.value)}
      />
      <Text style={{flex: 1, marginLeft: 8}}>{item.label}</Text>
    </View>
  );

  return (
    <>
      <TouchableOpacity
        style={[styles.input, style]}
        onPress={() => setVisible(true)}>
        <Text
          style={{
            color: selected.length ? '#333' : '#888',
            // fontWeight: 'bold',
          }}>
          {selected.length
            ? selected.length > 3
              ? `Đã chọn ${selected.length} mục`
              : options
                  .filter(opt => selected.includes(opt.value))
                  .map(opt => opt.label)
                  .join(', ')
            : placeholder}
        </Text>
      </TouchableOpacity>
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={() => setVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modal, modalStyle]}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <TextInput
              style={styles.search}
              placeholder={searchPlaceholder}
              value={search}
              onChangeText={setSearch}
              autoFocus
            />
            {/* Check all */}
            <View style={[styles.option, {marginBottom: 4}]}>
              <MyCheckbox
                checked={isAllChecked}
                onValueChange={toggleSelectAll}
              />
              <Text style={{flex: 1, marginLeft: 8, fontWeight: 'bold'}}>
                {isAllChecked ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
              </Text>
              {selected.length > 0 && (
                <Text style={{color: 'gray', fontWeight: 'bold'}}>
                  Đã chọn: {selected.length}
                </Text>
              )}
            </View>
            <ScrollView style={{maxHeight: 300}}>
              <FlatList
                data={filteredOptions}
                keyExtractor={item => item.value.toString()}
                renderItem={renderOption}
                keyboardShouldPersistTaps="handled"
              />
            </ScrollView>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}>
              <Text style={{color: '#007AFF', fontWeight: 'bold'}}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    width: '85%',
    maxWidth: 400,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  search: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 40,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 4,
  },
  selected: {
    backgroundColor: '#e6f0ff',
  },
  check: {
    color: '#007AFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeBtn: {
    marginTop: 16,
    alignSelf: 'center',
    padding: 8,
  },
});

export default MultiSelect;
