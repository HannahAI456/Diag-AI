import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';

const {width} = Dimensions.get('window');

const CustomTabView = ({
  routes,
  renderScene,
  tabBarProps = {},
  style,
  lazy = true,
  onIndexChange,
  ...otherProps
}) => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const handleIndexChange = newIndex => {
    setIndex(newIndex);
    if (onIndexChange) {
      onIndexChange(newIndex);
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={[styles.indicator, tabBarProps.indicatorStyle]}
      style={[styles.tabBar, tabBarProps.style]}
      labelStyle={[styles.label, tabBarProps.labelStyle]}
      activeColor={tabBarProps.activeColor || '#007AFF'}
      inactiveColor={tabBarProps.inactiveColor || '#8E8E93'}
      pressColor={tabBarProps.pressColor || 'rgba(0, 122, 255, 0.1)'}
      scrollEnabled={tabBarProps.scrollEnabled || false}
      tabStyle={[styles.tab, tabBarProps.tabStyle]}
      renderLabel={({route, focused, color}) => (
        <Text
          numberOfLines={1}
          ellipsizeMode="tail"
          style={[styles.labelText, {color}, tabBarProps.labelStyle]}>
          {route.title}
        </Text>
      )}
    />
  );

  // Render placeholder khi tab chưa được load (lazy loading)
  const renderLazyPlaceholder = ({route}) => (
    <View style={styles.lazyPlaceholder}>
      <ActivityIndicator
        size="large"
        color={tabBarProps.activeColor || '#007AFF'}
      />
      <Text style={styles.lazyText}>Đang tải...</Text>
    </View>
  );

  return (
    <TabView
      // swipeEnabled={Platform.OS == 'ios' ? true : false}
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={handleIndexChange}
      initialLayout={{width: layout.width}}
      renderTabBar={renderTabBar}
      lazy={lazy}
      renderLazyPlaceholder={renderLazyPlaceholder}
      lazyPreloadDistance={0} // Chỉ load tab hiện tại, không preload tab bên cạnh
      style={[styles.container, style]}
      {...otherProps}
    />
  );
};

// Component mẫu để demo
const FirstRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#ff4081'}]}>
    <Text style={styles.sceneText}>Tab đầu tiên</Text>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#673ab7'}]}>
    <Text style={styles.sceneText}>Tab thứ hai</Text>
  </View>
);

const ThirdRoute = () => (
  <View style={[styles.scene, {backgroundColor: '#3f51b5'}]}>
    <Text style={styles.sceneText}>Tab thứ ba</Text>
  </View>
);

// Component demo với dữ liệu mẫu
const DemoTabView = () => {
  const routes = [
    {key: 'first', title: 'Đầu tiên'},
    {key: 'second', title: 'Thứ hai'},
    {key: 'third', title: 'Thứ ba'},
  ];

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
  });

  return (
    <CustomTabView
      routes={routes}
      renderScene={renderScene}
      tabBarProps={{
        activeColor: '#007AFF',
        inactiveColor: '#8E8E93',
        indicatorStyle: {backgroundColor: '#007AFF'},
        style: {backgroundColor: '#FFFFFF'},
        tabStyle: {
          width: 'auto',
        },
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 4,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
  },
  indicator: {
    backgroundColor: '#007AFF',
    height: 3,
    borderRadius: 1.5,
  },
  tab: {
    // Style mặc định cho mỗi tab
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  label: {
    fontWeight: '600',
    fontSize: 12,
    textTransform: 'none',
  },
  labelText: {
    fontWeight: '600',
    fontSize: 12,
    textAlign: 'center',
    flexWrap: 'nowrap',
  },
  scene: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sceneText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  lazyPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  lazyText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
});

export default CustomTabView;
export {DemoTabView};
