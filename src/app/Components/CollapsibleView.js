import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  UIManager,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const CollapsibleView = ({
  title = 'Collapsible View',
  children,
  initialCollapsed = true,
  headerStyle,
  contentStyle,
  titleStyle,
  iconColor = '#007AFF',
  backgroundColor = '#f5f5f5',
  borderColor = '#e0e0e0',
  animationDuration = 350,
}) => {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [contentHeight, setContentHeight] = useState(0);
  const progress = useRef(new Animated.Value(initialCollapsed ? 0 : 1)).current;
  const rotateValue = useRef(
    new Animated.Value(initialCollapsed ? 0 : 1),
  ).current;

  const toggleCollapsed = () => {
    const toValue = collapsed ? 1 : 0;

    Animated.timing(progress, {
      toValue,
      duration: animationDuration,
      useNativeDriver: false,
    }).start();

    Animated.timing(rotateValue, {
      toValue,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();

    setCollapsed(!collapsed);
  };

  const rotate = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const animatedHeight = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const animatedOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.container, {backgroundColor, borderColor}]}>
      <TouchableOpacity
        style={[styles.header, headerStyle]}
        onPress={toggleCollapsed}
        activeOpacity={0.7}>
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
        <Animated.View style={{transform: [{rotate}]}}>
          <Icon name="chevron-down" size={24} color={iconColor} />
        </Animated.View>
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.content,
          contentStyle,
          {
            height: animatedHeight,
            opacity: animatedOpacity,
            overflow: 'hidden',
          },
        ]}
        pointerEvents={collapsed ? 'none' : 'auto'}>
        <View
          style={styles.inner}
          onLayout={e => {
            const h = e.nativeEvent.layout.height;
            if (h !== contentHeight) setContentHeight(h);
          }}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  content: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  inner: {
    padding: 16,
  },
});

export default CollapsibleView;
