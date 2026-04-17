import React, {useState, useMemo} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SectionList,
  TextInput,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AppColors} from '../Common/AppColor';

const {height: screenHeight} = Dimensions.get('window');

const FilterModal = ({
  visible,
  onClose,
  parentTabs = [],
  parentChildMap = {},
  onSelectTab,
  currentParentId,
  currentChildId,
}) => {
  const [searchText, setSearchText] = useState('');

  // Build sections for SectionList
  const filteredSections = useMemo(() => {
    const sections = [];
    const lowerSearch = searchText.toLowerCase().trim();

    parentTabs.forEach(parent => {
      const parentName = (parent.Ten || parent.name || '').toLowerCase();
      const children = parentChildMap[parent.id] || [];

      // Filter children based on search
      const matchedChildren = children.filter(child => {
        const childName = (child.Ten || child.name || '').toLowerCase();
        return childName.includes(lowerSearch);
      });

      // Determine if parent matches search
      const parentMatches = parentName.includes(lowerSearch);

      // Include section if:
      // 1. No search text (show all)
      // 2. Parent name matches
      // 3. At least one child matches
      if (!lowerSearch || parentMatches || matchedChildren.length > 0) {
        sections.push({
          parentId: parent.id,
          title: parent.Ten || parent.name,
          data: lowerSearch && !parentMatches ? matchedChildren : children,
          parent: parent,
        });
      }
    });

    return sections;
  }, [parentTabs, parentChildMap, searchText]);

  const handleSelectChild = (parent, child) => {
    if (onSelectTab) {
      onSelectTab(parent, child);
    }
    handleClose();
  };

  const handleSelectParent = parent => {
    if (onSelectTab) {
      onSelectTab(parent, null);
    }
    handleClose();
  };

  const handleClose = () => {
    setSearchText('');
    onClose();
  };

  const renderSectionHeader = ({section}) => {
    const isActiveParent = section.parentId === currentParentId;
    return (
      <TouchableOpacity
        style={[
          styles.sectionHeader,
          isActiveParent && styles.sectionHeaderActive,
        ]}
        onPress={() => handleSelectParent(section.parent)}
        activeOpacity={0.7}>
        <Text
          style={[
            styles.sectionHeaderText,
            isActiveParent && styles.sectionHeaderTextActive,
          ]}>
          {section.title}
        </Text>
        <Ionicons
          name="chevron-forward"
          size={18}
          color={isActiveParent ? AppColors.MainColor || '#017129' : '#666'}
        />
      </TouchableOpacity>
    );
  };

  const renderItem = ({item, section}) => {
    const isActiveChild =
      section.parentId === currentParentId && item.id === currentChildId;
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          isActiveChild && styles.itemContainerActive,
        ]}
        onPress={() => handleSelectChild(section.parent, item)}
        activeOpacity={0.7}>
        <View style={[styles.itemDot, isActiveChild && styles.itemDotActive]} />
        <Text style={[styles.itemText, isActiveChild && styles.itemTextActive]}>
          {item.Ten || item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color="#ccc" />
      <Text style={styles.emptyText}>Không có kết quả phù hợp</Text>
      <Text style={styles.emptySubText}>Thử tìm kiếm với từ khóa khác</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Danh mục</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color="#999"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm danh mục..."
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              autoCapitalize="none"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText('')}
                style={styles.clearButton}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>

          {/* Section List */}
          <SectionList
            sections={filteredSections}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderSectionHeader={renderSectionHeader}
            renderItem={renderItem}
            ListEmptyComponent={renderEmpty}
            stickySectionHeadersEnabled={false}
            contentContainerStyle={
              filteredSections.length === 0 ? styles.emptyListContent : null
            }
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: screenHeight * 0.8,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  sectionHeaderActive: {
    backgroundColor: '#e8f5e9',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.MainColor || '#017129',
    flex: 1,
  },
  sectionHeaderTextActive: {
    fontWeight: '800',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingLeft: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemContainerActive: {
    backgroundColor: '#f0f8f4',
  },
  itemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#999',
    marginRight: 12,
  },
  itemDotActive: {
    backgroundColor: AppColors.MainColor || '#017129',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
  },
  itemTextActive: {
    fontWeight: '700',
    color: AppColors.MainColor || '#017129',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
  emptyListContent: {
    flexGrow: 1,
  },
});

export default FilterModal;
