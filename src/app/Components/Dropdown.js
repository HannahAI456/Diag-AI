import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {MAX_H, MAX_W} from '../Common/GlobalStyles';

const Dropdown = ({
  options = [],
  selected,
  onSelect,
  placeholder = 'Select...',
  filter = false,
}) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const flatListRef = useRef(null);

  const filteredOptions = filter
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options;

  const selectedLabel = options.find(opt => opt.value === selected)?.label;

  const scrollToSelected = () => {
    if (selected && flatListRef.current) {
      const selectedIndex = filteredOptions.findIndex(
        opt => opt.value === selected,
      );
      if (selectedIndex >= 0) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: true,
            viewPosition: 0.5,
          });
        }, 100);
      }
    }
  };

  const openModal = () => {
    setVisible(true);
    setSearch('');
    scrollToSelected();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={openModal}
        activeOpacity={0.7}>
        <Text
          style={[styles.buttonText, !selectedLabel && styles.placeholderText]}>
          {selectedLabel || placeholder}
        </Text>
        <Icon
          name={visible ? 'chevron-up' : 'chevron-down'}
          size={22}
          color="#666"
        />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}>
          <View style={styles.dropdown}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>
                {filter ? 'Chọn và tìm kiếm' : 'Chọn dữ liệu'}
              </Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {filter && (
              <View style={styles.searchContainer}>
                <Icon
                  name="magnify"
                  size={20}
                  color="#999"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Tìm kiếm..."
                  placeholderTextColor="#999"
                  value={search}
                  onChangeText={setSearch}
                  autoFocus
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')}>
                    <Icon name="close-circle" size={18} color="#999" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            <FlatList
              ref={flatListRef}
              data={filteredOptions}
              keyExtractor={item => item.value?.toString()}
              renderItem={({item}) => {
                const isSelected = item.value === selected;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionContainer,
                      isSelected && styles.selectedOptionContainer,
                    ]}
                    onPress={() => {
                      onSelect(item.value);
                      setVisible(false);
                    }}
                    activeOpacity={0.6}>
                    <Text
                      style={[
                        styles.option,
                        isSelected && styles.selectedOption,
                      ]}>
                      {item.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmarkContainer}>
                        <Icon name="check-circle" size={22} color="#007AFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="file-search-outline" size={48} color="#ccc" />
                  <Text style={styles.emptyText}>Không tìm thấy kết quả</Text>
                  <Text style={styles.emptySubText}>
                    Thử tìm kiếm với từ khóa khác
                  </Text>
                </View>
              }
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onScrollToIndexFailed={info => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                    viewPosition: 0.5,
                  });
                });
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // marginVertical: 8,
  },
  button: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  buttonText: {
    fontSize: 15,
    color: '#1a1a1a',
    flex: 1,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#999',
    fontWeight: '400',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    width: MAX_W - 40,
    backgroundColor: '#fff',
    borderRadius: 16,
    maxHeight: MAX_H * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 12,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 10,
    color: '#1a1a1a',
    fontSize: 16,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  selectedOptionContainer: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1.5,
    borderColor: '#007AFF',
  },
  option: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  selectedOption: {
    color: '#007AFF',
    fontWeight: '600',
  },
  checkmarkContainer: {
    marginLeft: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
});

export default Dropdown;
