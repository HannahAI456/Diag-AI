import React, {useState, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Platform,
  TextInput,
  Animated,
  Keyboard,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeArea} from 'react-native-safe-area-context';
import {MAX_W} from '../../Common/GlobalStyles';
import {AppColors} from '../../Common/AppColor';

const TopNavigation = ({
  navigation,
  title,
  right,
  img = '',
  // Search props
  showSearch = false,
  onSearch,
  onClearSearch,
  searchPlaceholder = 'Tìm kiếm...',
  // Reload props (for WebView)
  showReload = false,
  onReload,
  // Filter props
  showFilter = false,
  onFilter,
}) => {
  const safeArea = useSafeArea();

  // Search state
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef(null);
  const searchAnim = useRef(new Animated.Value(0)).current;

  const toggleSearch = () => {
    if (isSearchVisible) {
      // Close search
      Animated.timing(searchAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start(() => {
        setIsSearchVisible(false);
        setSearchText('');
        if (onClearSearch) onClearSearch();
      });
      Keyboard.dismiss();
    } else {
      // Open search
      setIsSearchVisible(true);
      Animated.timing(searchAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        searchInputRef.current?.focus();
      });
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchText);
    }
    Keyboard.dismiss();
  };

  const handleClear = () => {
    setSearchText('');
    if (onClearSearch) onClearSearch();
    searchInputRef.current?.focus();
  };

  // Animation values
  const titleOpacity = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const searchContainerFlex = searchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const H = safeArea.top + 55;

  const hasImage = !!img;

  if (hasImage) {
    return (
      <ImageBackground
        source={{
          uri: img,
        }}
        style={[styles.container, {height: H}]}
        imageStyle={styles.bgImage}
        defaultSource={{
          uri: img,
        }}
        blurRadius={Platform.OS === 'ios' ? 100 : 100}
      >
        <View style={[StyleSheet.absoluteFill, styles.overlay]} />
        <View style={[styles.row, {paddingTop: safeArea.top}]}>
          {/* Back */}
          {navigation && (
            <TouchableOpacity
              onPress={() => navigation.goBack?.()}
              activeOpacity={0.7}
              style={styles.BtnBack}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Ionicons name="arrow-back" size={22} color="#2F2F2F" />
            </TouchableOpacity>
          )}

          {/* Title - Ẩn khi search visible */}
          {showSearch ? (
            <Animated.Text
              numberOfLines={1}
              style={[styles.title, {opacity: titleOpacity}]}
              pointerEvents={isSearchVisible ? 'none' : 'auto'}>
              {title}
            </Animated.Text>
          ) : (
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
          )}

          {/* Search Container - Expand khi search visible */}
          {showSearch && isSearchVisible && (
            <Animated.View
              style={[
                styles.searchInputContainer,
                {
                  flex: searchContainerFlex,
                  marginLeft: 10,
                },
              ]}>
              <TextInput
                ref={searchInputRef}
                style={styles.searchInputInNav}
                placeholder={searchPlaceholder}
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchText.length > 0 && (
                <TouchableOpacity
                  style={styles.clearIconButton}
                  onPress={handleClear}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.searchIconButton}
                onPress={handleSearch}>
                <Ionicons name="search" size={18} color={AppColors.MainColor} />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Right: Filter, Search Toggle, Reload hoặc Custom Right */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            {showFilter && (
              <TouchableOpacity
                style={styles.searchToggleButton}
                onPress={onFilter}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Ionicons name="funnel-outline" size={22} color="#2F2F2F" />
              </TouchableOpacity>
            )}
            {showReload && (
              <TouchableOpacity
                style={styles.searchToggleButton}
                onPress={onReload}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Ionicons name="reload" size={22} color="#2F2F2F" />
              </TouchableOpacity>
            )}
            {showSearch && (
              <TouchableOpacity
                style={styles.searchToggleButton}
                onPress={toggleSearch}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Ionicons
                  name={isSearchVisible ? 'close' : 'search'}
                  size={22}
                  color="#2F2F2F"
                />
              </TouchableOpacity>
            )}
            {!showFilter && !showReload && !showSearch && (right ?? null)}
          </View>
        </View>
      </ImageBackground>
    );
  }

  return (
    <LinearGradient
      colors={['#04724D', '#2AB574']}
      start={{x: 0, y: 1}}
      style={[styles.container, {height: H}]}
      end={{x: 1, y: 0}}>
      <View style={[styles.row, {paddingTop: safeArea.top}]}>
        {/* Back */}
        {navigation && (
          <TouchableOpacity
            onPress={() => navigation.goBack?.()}
            activeOpacity={0.7}
            style={styles.BtnBack}
            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
            <Ionicons name="arrow-back" size={22} color="#2F2F2F" />
          </TouchableOpacity>
        )}

        {/* Title - Ẩn khi search visible */}
        {showSearch ? (
          <Animated.Text
            numberOfLines={1}
            style={[styles.title, {opacity: titleOpacity}]}
            pointerEvents={isSearchVisible ? 'none' : 'auto'}>
            {title}
          </Animated.Text>
        ) : (
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>
        )}

        {/* Search Container - Expand khi search visible */}
        {showSearch && isSearchVisible && (
          <Animated.View
            style={[
              styles.searchInputContainer,
              {
                flex: searchContainerFlex,
                marginLeft: 10,
              },
            ]}>
            <TextInput
              ref={searchInputRef}
              style={styles.searchInputInNav}
              placeholder={searchPlaceholder}
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                style={styles.clearIconButton}
                onPress={handleClear}>
                <Ionicons name="close-circle" size={18} color="#999" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.searchIconButton}
              onPress={handleSearch}>
              <Ionicons name="search" size={18} color={AppColors.MainColor} />
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Right: Filter, Search Toggle, Reload hoặc Custom Right */}
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          {showFilter && (
            <TouchableOpacity
              style={styles.searchToggleButton}
              onPress={onFilter}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Ionicons name="funnel" size={22} color={AppColors.MainColor} />
            </TouchableOpacity>
          )}
          {showReload && (
            <TouchableOpacity
              style={styles.searchToggleButton}
              onPress={onReload}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Ionicons name="reload" size={22} color={AppColors.MainColor} />
            </TouchableOpacity>
          )}
          {showSearch && (
            <TouchableOpacity
              style={styles.searchToggleButton}
              onPress={toggleSearch}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Ionicons
                name={isSearchVisible ? 'close' : 'search'}
                size={22}
                color="#2F2F2F"
              />
            </TouchableOpacity>
          )}
          {!showFilter && !showReload && !showSearch && (right ?? null)}
        </View>
      </View>
    </LinearGradient>
  );
};

export default TopNavigation;

const styles = StyleSheet.create({
  container: {
    width: MAX_W,
    justifyContent: 'center',
    zIndex: 100,
    backgroundColor: '#FFF', // fallback nếu ảnh chưa load
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  // Làm ảnh “nhạt nhạt”
  bgImage: {
    opacity: 0.95,
    resizeMode: 'cover',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  BtnBack: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
    // shadow Android
  },
  title: {
    flex: 1,
    // textAlign: 'center',
    // marginHorizontal: 10,
    marginLeft: 10,
    fontSize: 17,
    fontWeight: '700',
    color: '#ffff',
  },
  // Search styles
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    marginRight: 8,
    paddingHorizontal: 10,
    height: 36,
    overflow: 'hidden',
  },
  searchInputInNav: {
    flex: 1,
    fontSize: 14,
    color: '#2F2F2F',
    paddingVertical: 0,
    paddingHorizontal: 5,
  },
  clearIconButton: {
    padding: 4,
  },
  searchIconButton: {
    padding: 4,
  },
  searchToggleButton: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
});
