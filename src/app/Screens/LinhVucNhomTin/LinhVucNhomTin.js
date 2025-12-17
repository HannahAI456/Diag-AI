import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import {TabBar, TabView} from 'react-native-tab-view';
import LinearGradient from 'react-native-linear-gradient';
import {AppColors} from '../../Common/AppColor';
import {useSafeArea} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {SharedElement} from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  getTinTucChuDePhanCap,
  getTinTucBaiVietPhanTrang,
  parseDescriptionParams,
} from '../../Api/TinTucService';
import {MAX_W} from '../../Common/GlobalStyles';
import Utilities from '../../Common/Utilities';
import Global from '../../LocalData/Global';
import {RootNavigation} from '../../Common/RootNavigation';

const LinhVucNhomTin = ({navigation, route}) => {
  const {data: initValues} = route.params;
  const insets = useSafeArea();
  const [selectedParentTab, setSelectedParentTab] = useState(null);
  const [selectedChildTab, setSelectedChildTab] = useState(null);
  const [childTabs, setChildTabs] = useState([]);
  const [flatRoutes, setFlatRoutes] = useState([]);
  const [tabIndex, setTabIndex] = useState(0);
  const [articlesMap, setArticlesMap] = useState({});
  const [parentParamsMap, setParentParamsMap] = useState({});
  const [parentChildMap, setParentChildMap] = useState({});
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const parentScrollRef = useRef(null);
  const childScrollRef = useRef(null);
  const parentTabRefs = useRef({});
  const childTabRefs = useRef({});
  const linhVucIdRef = useRef(null);
  const layout = useWindowDimensions();

  // Refs to prevent duplicate loads and track loading state
  const loadingRouteRef = useRef(null);
  const isChangingTabRef = useRef(false);

  // Add "Tất cả" tab at the beginning of parent tabs
  const allParentTab = {
    id: 'all-parent',
    name: 'Tất cả',
    code: 'TatCa',
    description: '', // No description means no child tabs
    isAllTab: true,
  };

  const filteredTabs =
    initValues?.children?.filter(item => item?.code !== 'HeaderLinhVuc') || [];
  const parentTabs = [allParentTab, ...filteredTabs];

  useEffect(() => {
    // Build child tabs for all parents and flatten into tab-view routes
    const buildAllChildTabs = async () => {
      if (!parentTabs || parentTabs.length === 0) return;

      const tempChildMap = {};
      const tempParentParams = {};

      for (const p of parentTabs) {
        // Special-case top-level "Tất cả" parent: no child tabs
        if (p.id === allParentTab.id || p.isAllTab) {
          tempChildMap[p.id] = [];
          tempParentParams[p.id] = null;
          continue;
        }

        // Default: if no description -> no child
        if (!p.description) {
          tempChildMap[p.id] = [];
          tempParentParams[p.id] = null;
          continue;
        }

        try {
          const params = parseDescriptionParams(p.description);
          tempParentParams[p.id] = params;
          const result = await getTinTucChuDePhanCap(params);
          if (result?.items && result.items.length > 0) {
            const allTab = {
              id: 'all',
              ten: 'Tất cả',
              duongDan: '',
              isAllTab: true,
            };
            tempChildMap[p.id] = [allTab, ...result.items];
          } else {
            tempChildMap[p.id] = [];
          }
        } catch (err) {
          console.log('Error loading child for parent', p, err);
          tempChildMap[p.id] = [];
          tempParentParams[p.id] = {};
        }
      }

      // Build flat routes
      const routes = [];
      for (let pi = 0; pi < parentTabs.length; pi++) {
        const p = parentTabs[pi];
        const children = tempChildMap[p.id] || [];
        if (children.length === 0) {
          // create single pseudo-child representing parent without children
          const child = {id: 'all', ten: p.name, isAllTab: true};
          const key = `${p.id}_${child.id}`;
          routes.push({
            key,
            title: child.ten,
            parentId: p.id,
            parentIndex: pi,
            childIndex: 0,
            child,
          });
        } else {
          for (let ci = 0; ci < children.length; ci++) {
            const child = children[ci];
            const key = `${p.id}_${child.id}`;
            routes.push({
              key,
              title: child.ten,
              parentId: p.id,
              parentIndex: pi,
              childIndex: ci,
              child,
            });
          }
        }
      }

      setParentParamsMap(tempParentParams);
      setParentChildMap(tempChildMap);
      // For initial parent (index 0), if it's the top-level all parent, don't set childTabs
      if (parentTabs[0].isAllTab) {
        setChildTabs([]);
        setSelectedChildTab(null);
      } else {
        setChildTabs(tempChildMap[parentTabs[0].id] || []);
        setSelectedChildTab((tempChildMap[parentTabs[0].id] || [])[0] || null);
      }
      setSelectedParentTab(parentTabs[0]);
      setFlatRoutes(routes);
      // load first route data
      if (routes.length > 0) {
        loadArticlesForRoute(routes[0].key, 1, false);
      }
    };

    buildAllChildTabs();
  }, []);
  console.log('childTabs', childTabs);
  const loadCategories = async parentTab => {
    // kept for compatibility when called from parent taps: rebuild childTabs from parentParamsMap
    const children = [];
    if (!parentTab?.description || parentTab?.isAllTab) {
      setChildTabs([]);
      setSelectedChildTab(null);
      linhVucIdRef.current = '';
      setArticles([]);
      setPage(1);
      setHasMore(true);
      loadArticlesForParent(parentTab, 1, false);
      return;
    }
    try {
      setLoading(true);
      const params = parseDescriptionParams(parentTab.description);
      linhVucIdRef.current = params.LinhVucId;
      const result = await getTinTucChuDePhanCap(params);
      if (result?.items && result.items.length > 0) {
        const allTab = {id: 'all', ten: 'Tất cả', duongDan: '', isAllTab: true};
        const tabsWithAll = [allTab, ...result.items];
        setChildTabs(tabsWithAll);
        setSelectedChildTab(allTab);
        loadArticles(1, false, allTab);
      } else {
        setChildTabs([]);
        setSelectedChildTab(null);
        loadArticles(1, false, null);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      setChildTabs([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper: load articles for a flat route
  const loadArticlesForRoute = useCallback(
    async (routeKey, pageNum = 1, isLoadMore = false, forceLoad = false) => {
      // Prevent duplicate loads for the same route
      if (!forceLoad && !isLoadMore && loadingRouteRef.current === routeKey) {
        return;
      }

      // Check if data already exists and is not stale
      const existingData = articlesMap[routeKey];
      if (
        !forceLoad &&
        !isLoadMore &&
        existingData?.items?.length > 0 &&
        !existingData.loading
      ) {
        return;
      }

      loadingRouteRef.current = routeKey;

      try {
        // Try to find route in current flatRoutes. It's possible this is
        // called immediately after building routes before state updates
        // have applied — in that case reconstruct the route from the key.
        let route = flatRoutes.find(r => r.key === routeKey);
        if (!route) {
          const parts = (routeKey || '').split('_');
          const parentId = parts[0] || null;
          const childId = parts[1] || null;
          if (!parentId) return;

          const parentIndex = parentTabs.findIndex(p => p.id === parentId);
          const children = parentChildMap[parentId] || [];
          let child = null;
          if (!children || children.length === 0) {
            child = {
              id: 'all',
              ten: parentTabs[parentIndex]?.name || 'Tất cả',
              isAllTab: true,
            };
          } else {
            child =
              children.find(c => String(c.id) === String(childId)) ||
              children[0];
          }

          route = {
            key: routeKey,
            parentId,
            parentIndex: parentIndex === -1 ? 0 : parentIndex,
            childIndex:
              children && children.length > 0
                ? Math.max(
                    0,
                    children.findIndex(c => String(c.id) === String(child?.id)),
                  )
                : 0,
            child,
          };
        }

        const parentId = route.parentId;
        const child = route.child;
        const parentParams = parentParamsMap[parentId] || {};
        const linhVucId = parentParams?.LinhVucId || '';

        const current = articlesMap[routeKey] || {
          items: [],
          page: 0,
          hasMore: true,
        };
        if (isLoadMore && !current.hasMore) return;

        // build params for API
        const params = {
          page: pageNum,
          pageSize: 15,
          loaiTinTuc: 'tintuc',
        };
        if (linhVucId) params.linhVucId = linhVucId;
        if (child && !child.isAllTab) {
          params.duongDanChuDe = child.duongDan || '';
          params.danhSachChuDe = child.id || '';
        }

        // update loading state per route
        setArticlesMap(prev => ({
          ...prev,
          [routeKey]: {...(prev[routeKey] || {}), loading: true},
        }));

        const result = await getTinTucBaiVietPhanTrang(params);
        const items = result.items || [];
        setArticlesMap(prev => ({
          ...prev,
          [routeKey]: {
            items:
              pageNum === 1
                ? items
                : [...(prev[routeKey]?.items || []), ...items],
            page: pageNum,
            hasMore: result.hasMore,
            loading: false,
            refreshing: false,
          },
        }));
      } catch (err) {
        console.log('Error loadArticlesForRoute', err);
        setArticlesMap(prev => ({
          ...(prev || {}),
          [routeKey]: {
            ...(prev[routeKey] || {}),
            loading: false,
            refreshing: false,
          },
        }));
      } finally {
        // Clear loading ref after a short delay to prevent rapid re-triggers
        setTimeout(() => {
          if (loadingRouteRef.current === routeKey) {
            loadingRouteRef.current = null;
          }
        }, 100);
      }
    },
    [flatRoutes, parentTabs, parentChildMap, parentParamsMap, articlesMap],
  );

  const loadArticlesForParent = parentTab => {
    // convenience: load first child of parent
    const route = flatRoutes.find(r => r.parentId === parentTab.id);
    if (route) {
      loadArticlesForRoute(route.key, 1, false);
    }
  };

  const loadArticles = async (
    pageNum = 1,
    isLoadMore = false,
    childTab = null,
  ) => {
    // Allow loading even if linhVucIdRef is empty (for "Tất cả" tab)
    if (linhVucIdRef.current === null) return;

    if (isLoadMore && !hasMore) return;
    if (isLoadMore && loadingMore) return;

    // Use provided childTab or fall back to selectedChildTab
    const activeChildTab = childTab || selectedChildTab;

    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const params = {
        page: pageNum,
        pageSize: 15,
        loaiTinTuc: 'tintuc',
      };

      // Only add linhVucId if it's not empty (not "Tất cả" parent tab)
      if (linhVucIdRef.current) {
        params.linhVucId = linhVucIdRef.current;
      }

      // Only add duongDanChuDe if not "All" tab
      if (activeChildTab && !activeChildTab.isAllTab) {
        params.duongDanChuDe = activeChildTab.duongDan || '';
        params.danhSachChuDe = activeChildTab.id || '';
      }

      console.log('Loading articles with params:', params);

      const result = await getTinTucBaiVietPhanTrang(params);
      console.log('Articles loaded:', result);

      if (isLoadMore) {
        setArticles(prev => [...prev, ...result.items]);
      } else {
        setArticles(result.items);
      }

      setPage(pageNum);
      setTotalCount(result.totalCount);
      setHasMore(result.hasMore);
    } catch (error) {
      console.log('Error loading articles:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    // refresh current tab in TabView
    const route = flatRoutes[tabIndex];
    if (route) {
      setArticlesMap(prev => ({
        ...prev,
        [route.key]: {...(prev[route.key] || {}), refreshing: true},
      }));
      loadArticlesForRoute(route.key, 1, false);
    }
  };

  const handleLoadMore = () => {
    const route = flatRoutes[tabIndex];
    if (!route) return;
    const state = articlesMap[route.key] || {};
    if (state.hasMore && !state.loading) {
      loadArticlesForRoute(route.key, (state.page || 1) + 1, true);
    }
  };

  const handleArticlePress = useCallback(
    article => {
      RootNavigation.navigate('ChiTietBaiViet', {
        item: {
          id: article.id,
          Ten: article.tieuDe,
          MoTa: article.noiDungTomTat,
          BieuTuong: article.hinhAnh?.path
            ? Global.AssetLinkUrl + article.hinhAnh.path
            : null,
          Ngay: article.ngayXuatBan,
          ...article,
        },
        Ma: 'TinTucNhomTin',
        LienKet:
          'tin-tuc-bai-viet/trang-ngoai/doc-danh-sach-phan-trang?LoaiTinTuc=tintuc&SkipCount=0&MaxResultCount=10&linhVuc=' +
          linhVucIdRef.current +
          (selectedChildTab?.isAllTab
            ? ''
            : '&danhSachChuDe=' + selectedChildTab?.id) +
          '&duongDanChuDe=',
        // Pass topic info for related articles
        topicId: selectedChildTab?.isAllTab ? null : selectedChildTab?.id,
        linhVucId: linhVucIdRef.current,
      });
    },
    [selectedChildTab],
  );

  // Check if currently on "Tất cả" parent tab
  const isAllParentTab = selectedParentTab?.isAllTab === true;

  const scrollToCenter = (scrollRef, tabRef) => {
    if (!scrollRef?.current || !tabRef || !tabRef.measureLayout) return;
    try {
      tabRef.measureLayout(
        scrollRef.current.getInnerViewNode(),
        (x, y, width, height) => {
          // center the tab: offset so the tab's center aligns with screen center
          const screenWidth = layout.width || 0;
          const tabCenter = x + width / 2;
          const offset = Math.max(0, tabCenter - screenWidth / 2);
          scrollRef.current.scrollTo({x: offset, animated: true});
        },
        () => {
          // measure failed; fallback to simple scroll
          scrollRef.current.scrollTo({x: 0, animated: true});
        },
      );
    } catch (e) {
      // ignore errors
    }
  };

  const renderTabBar = useCallback(
    props => (
      <TabBar
        {...props}
        indicatorStyle={{backgroundColor: 'white'}}
        style={{backgroundColor: 'pink', height: 0}}
      />
    ),
    [],
  );
  return (
    <LinearGradient colors={['#fafafa', '#fafafa']} style={styles.container}>
      <LinearGradient
        colors={['#04724D', '#2AB574']}
        start={{x: 0, y: 1}}
        style={{height: insets.top}}
      />

      <View style={styles.parentTabsContainer}>
        <ScrollView
          ref={parentScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.parentTabsContent}>
          {parentTabs.map((tab, pidx) => (
            <TouchableOpacity
              key={tab.id}
              ref={ref => (parentTabRefs.current[tab.id] = ref)}
              style={[
                styles.parentTab,
                selectedParentTab?.id === tab.id && styles.parentTabActive,
              ]}
              onPress={() => {
                // Prevent rapid tab changes
                if (isChangingTabRef.current) return;
                isChangingTabRef.current = true;

                // jump to first flat route of this parent
                const targetIndex = flatRoutes.findIndex(
                  r => r.parentId === tab.id,
                );
                if (targetIndex !== -1) {
                  setTabIndex(targetIndex);
                  // Only load if data doesn't exist
                  const existingData = articlesMap[flatRoutes[targetIndex].key];
                  if (!existingData?.items?.length) {
                    loadArticlesForRoute(flatRoutes[targetIndex].key, 1, false);
                  }
                }
                setSelectedParentTab(tab);
                // set child tabs from cached map (if available)
                const mapped = parentChildMap[tab.id];
                if (mapped && mapped.length > 0) {
                  setChildTabs(mapped);
                  setSelectedChildTab(mapped[0]);
                } else if (parentParamsMap[tab.id]) {
                  // has params but no cached children yet -> trigger loadCategories
                  loadCategories(tab);
                } else {
                  // no children
                  setChildTabs([]);
                  setSelectedChildTab(null);
                }
                scrollToCenter(parentScrollRef, parentTabRefs.current[tab.id]);

                // Reset flag after animation
                setTimeout(() => {
                  isChangingTabRef.current = false;
                }, 300);
              }}>
              <Text
                style={[
                  styles.parentTabText,
                  selectedParentTab?.id === tab.id &&
                    styles.parentTabTextActive,
                ]}>
                {tab.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* child pills for current parent */}
      {selectedParentTab && (
        <View style={styles.childTabsContainer}>
          <ScrollView
            ref={childScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.childTabsContent}>
            {(childTabs && childTabs.length > 0
              ? childTabs
              : parentChildMap[selectedParentTab.id] &&
                parentChildMap[selectedParentTab.id].length > 0
              ? parentChildMap[selectedParentTab.id]
              : parentParamsMap[selectedParentTab.id]
              ? [{id: 'all', ten: 'Tất cả', isAllTab: true}]
              : []
            ).map(child => {
              const key = `${selectedParentTab.id}_${child.id}`;
              const routeIndex = flatRoutes.findIndex(r => r.key === key);
              const isActive = flatRoutes[tabIndex]?.key === key;
              return (
                <TouchableOpacity
                  key={child.id}
                  ref={ref =>
                    (childTabRefs.current[
                      `${selectedParentTab.id}_${child.id}`
                    ] = ref)
                  }
                  style={[
                    styles.childTab,
                    isActive && styles.childTabActivePill,
                  ]}
                  onPress={() => {
                    // Prevent rapid tab changes
                    if (isChangingTabRef.current) return;
                    isChangingTabRef.current = true;

                    if (routeIndex !== -1) {
                      setTabIndex(routeIndex);
                      // Only load if data doesn't exist
                      const existingData =
                        articlesMap[flatRoutes[routeIndex].key];
                      if (!existingData?.items?.length) {
                        loadArticlesForRoute(
                          flatRoutes[routeIndex].key,
                          1,
                          false,
                        );
                      }
                    }
                    setSelectedChildTab(child);
                    scrollToCenter(
                      childScrollRef,
                      childTabRefs.current[
                        `${selectedParentTab.id}_${child.id}`
                      ],
                    );

                    // Reset flag after animation
                    setTimeout(() => {
                      isChangingTabRef.current = false;
                    }, 300);
                  }}>
                  <Text
                    style={[
                      styles.childTabText,
                      isActive && styles.childTabTextActive,
                    ]}>
                    {child.ten}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* TabView */}
      {flatRoutes.length > 0 && (
        <TabView
          animationEnabled={false}
          lazy
          lazyPreloadDistance={1}
          renderTabBar={renderTabBar}
          navigationState={{index: tabIndex, routes: flatRoutes}}
          renderScene={({route}) => (
            <TabScene
              routeKey={route.key}
              articlesMap={articlesMap}
              handleArticlePress={handleArticlePress}
              loadArticlesForRoute={loadArticlesForRoute}
              selectedParentTab={selectedParentTab}
            />
          )}
          onIndexChange={idx => {
            // Prevent rapid tab changes from causing issues
            if (isChangingTabRef.current) return;
            isChangingTabRef.current = true;

            setTabIndex(idx);
            const r = flatRoutes[idx];
            if (r) {
              // sync parent + child selection
              const p = parentTabs[r.parentIndex];
              setSelectedParentTab(p);
              const mapped = parentChildMap[p.id];
              if (mapped && mapped.length > 0) {
                setChildTabs(mapped);
                const selChild = mapped[r.childIndex] || mapped[0];
                setSelectedChildTab(selChild);
                // center the selected child pill in view
                setTimeout(() => {
                  const key = `${p.id}_${selChild.id}`;
                  const ref = childTabRefs.current[key];
                  scrollToCenter(childScrollRef, ref);
                }, 120);
              } else if (parentParamsMap[p.id]) {
                // fallback: fetch categories for this parent
                loadCategories(p);
              } else {
                setChildTabs([]);
                setSelectedChildTab(null);
              }
              // Load articles only if not already loaded
              const existingData = articlesMap[r.key];
              if (!existingData?.items?.length) {
                loadArticlesForRoute(r.key, 1, false);
              }
              // center parent
              setTimeout(
                () =>
                  scrollToCenter(parentScrollRef, parentTabRefs.current[p.id]),
                80,
              );
            }

            // Reset flag after animation completes
            setTimeout(() => {
              isChangingTabRef.current = false;
            }, 300);
          }}
          initialLayout={{width: layout.width}}
        />
      )}

      {/* Articles List */}
      {/* <FlatList
        data={articles}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({item, index}) =>
          index === 0 ? (
            <RenderFirstArticle item={item} onPress={handleArticlePress} />
          ) : (
            <RenderArticleCard
              item={item}
              onPress={handleArticlePress}
              showLinhVuc={isAllParentTab}
            />
          )
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#017129" />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Icon name="inbox" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Đang cập nhật thông tin</Text>
            </View>
          )
        }
        ListFooterComponent={
          !loading && loadingMore ? (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color="#017129" />
            </View>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#017129"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
      /> */}
    </LinearGradient>
  );
};

// Extracted TabScene component to prevent re-creation on every render
const TabScene = React.memo(
  ({
    routeKey,
    articlesMap,
    handleArticlePress,
    loadArticlesForRoute,
    selectedParentTab,
  }) => {
    const state = articlesMap[routeKey] || {items: [], loading: false};

    const keyExtractor = useCallback(
      (item, index) => item.id || index.toString(),
      [],
    );

    const renderItem = useCallback(
      ({item, index}) =>
        index === 0 ? (
          <RenderFirstArticle item={item} onPress={handleArticlePress} />
        ) : (
          <RenderArticleCard
            item={item}
            onPress={handleArticlePress}
            showLinhVuc={selectedParentTab?.isAllTab}
          />
        ),
      [handleArticlePress, selectedParentTab?.isAllTab],
    );

    const ListEmptyComponent = useMemo(
      () =>
        state.loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#017129" />
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="inbox" size={48} color="#ccc" />
            <Text style={styles.emptyText}>Đang cập nhật thông tin</Text>
          </View>
        ),
      [state.loading],
    );

    const ListFooterComponent = useMemo(
      () =>
        !state.loading && state.hasMore ? (
          <View style={styles.loadingMoreContainer}>
            <ActivityIndicator size="small" color="#017129" />
          </View>
        ) : null,
      [state.loading, state.hasMore],
    );

    const handleRefresh = useCallback(() => {
      loadArticlesForRoute(routeKey, 1, false, true);
    }, [routeKey, loadArticlesForRoute]);

    const handleEndReached = useCallback(() => {
      const s = articlesMap[routeKey] || {};
      if (s.hasMore && !s.loading) {
        loadArticlesForRoute(routeKey, (s.page || 1) + 1, true);
      }
    }, [routeKey, articlesMap, loadArticlesForRoute]);

    return (
      <View style={{flex: 1}}>
        <FlatList
          data={state.items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          refreshControl={
            <RefreshControl
              refreshing={state.refreshing || false}
              onRefresh={handleRefresh}
              tintColor="#017129"
            />
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          initialNumToRender={10}
          getItemLayout={undefined}
        />
      </View>
    );
  },
);

// Component for first article with full-width 16:9 image
const RenderFirstArticle = React.memo(({item, onPress}) => {
  const imageUrl = item.hinhAnh?.path
    ? Global.AssetLinkUrl + item.hinhAnh.path
    : null;

  return (
    <TouchableOpacity style={styles.firstArticle} onPress={() => onPress(item)}>
      {imageUrl ? (
        <SharedElement id={`item.${item.id}.image`}>
          <FastImage
            source={{uri: imageUrl}}
            style={styles.firstArticleImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </SharedElement>
      ) : (
        <FastImage
          source={{uri: imageUrl}}
          style={styles.firstArticleImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={styles.firstArticleOverlay}>
        <Text style={styles.firstArticleTitle} numberOfLines={2}>
          {item.tieuDe}
        </Text>
        <Text style={styles.firstArticleDate}>
          {Utilities.formatDateTime(item.ngayXuatBan)}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

// Component for regular article card with 4:3 image
const RenderArticleCard = React.memo(({item, onPress, showLinhVuc = false}) => {
  const imageUrl = item.hinhAnh?.path
    ? Global.AssetLinkUrl + item.hinhAnh.path
    : null;

  // Determine what description to show
  const description = showLinhVuc ? item.tenLinhVuc : item.noiDungTomTat;

  return (
    <TouchableOpacity style={styles.articleCard} onPress={() => onPress(item)}>
      {imageUrl ? (
        <SharedElement id={`item.${item.id}.image`}>
          <FastImage
            source={{uri: imageUrl}}
            style={styles.articleImage}
            resizeMode={FastImage.resizeMode.cover}
          />
        </SharedElement>
      ) : null}
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.tieuDe}
        </Text>
        {showLinhVuc ? (
          <>
            <Text style={styles.articleDate}>
              {Utilities.formatDateTime(item.ngayXuatBan)}
            </Text>
            {description ? (
              <Text
                style={[styles.articleDescription, {textAlign: 'right'}]}
                numberOfLines={2}>
                {description}
              </Text>
            ) : null}
          </>
        ) : (
          <>
            {description ? (
              <Text style={styles.articleDescription} numberOfLines={3}>
                {description}
              </Text>
            ) : null}
            <Text style={styles.articleDate}>
              {Utilities.formatDateTime(item.ngayXuatBan)}
            </Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
});

// Shared element configuration for navigation
LinhVucNhomTin.sharedElements = route => {
  const item = route.params?.item;
  if (item?.id) {
    return [`item.${item.id}.image`];
  }
  return [];
};

export default LinhVucNhomTin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
  },
  parentTabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  parentTabsContent: {
    paddingHorizontal: 16,
    gap: 20,
  },
  parentTab: {
    paddingVertical: 12,
    height: '100%',
  },
  parentTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#017129',
  },
  parentTabText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#666',
  },
  parentTabTextActive: {
    fontSize: 15,
    fontWeight: '700',
    color: '#017129',
  },
  childTabsContainer: {
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  childTabsContent: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    // gap: 16,
  },
  childTab: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'transparent',
  },
  childTabActive: {
    // backgroundColor: '#fff',
    // borderLeftWidth: 3,
    // borderLeftColor: '#8fb29aff',
  },
  childTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#666',
  },
  childTabTextActive: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333',
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  loadingMoreContainer: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  // First article - full width with 16:9 image
  firstArticle: {
    marginBottom: 16,
    backgroundColor: '#fff',
    overflow: 'hidden',
    position: 'relative',
  },
  firstArticleImage: {
    width: '100%',
    height: (MAX_W * 9) / 16, // 16:9 ratio
  },
  firstArticleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
  },
  firstArticleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 22,
  },
  firstArticleDate: {
    fontSize: 12,
    color: '#f0f0f0',
  },
  // Regular article card with 4:3 image
  articleCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 8,
    marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
    // elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  articleImage: {
    width: MAX_W * 0.35,
    height: (MAX_W * 0.35 * 3) / 4, // 4:3 ratio
  },
  articleContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  articleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  articleDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
    marginBottom: 4,
  },
  articleDate: {
    fontSize: 11,
    color: '#999',
  },
  placeholderImage: {
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  placeholderSmallText: {
    fontSize: 11,
    color: '#999',
  },
});
