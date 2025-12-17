import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeArea} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import {SharedElement} from 'react-navigation-shared-element';
import {getTinTucBaiVietPhanTrang} from '../../Api/TinTucService';
import {MAX_H, MAX_W} from '../../Common/GlobalStyles';
import Utilities from '../../Common/Utilities';
import Global from '../../LocalData/Global';
import {RootNavigation} from '../../Common/RootNavigation';

const ThongTinTheoNhom = ({item, route, isVisible = false}) => {
  const insets = useSafeArea();
  const [tabs, setTabs] = useState([]);
  const [selectedTab, setSelectedTab] = useState(null);
  const [articles, setArticles] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const tabScrollRef = useRef(null);
  const tabRefs = useRef({});
  const autoScrollInterval = useRef(null);
  const isUserManualChange = useRef(false); // Track if user manually changed tab
  
  useEffect(() => {
    loadArticles();
    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, []);

  // Effect to handle auto-scroll based on component visibility
  useEffect(() => {
    if (isVisible && tabs.length > 0) {
      // Start auto-scroll when component becomes visible
      startAutoScroll(tabs, isUserManualChange.current ? 30000 : 5000);
    } else {
      // Stop auto-scroll when component becomes invisible
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
        autoScrollInterval.current = null;
      }
    }
  }, [isVisible, tabs]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      const params = {
        maxResultCount: item?.description || 3,
        loaiTinTuc: 'tintuc',
        isActive: true,
      };

      const result = await getTinTucBaiVietPhanTrang(params);
      console.log('Articles loaded:', result);

      if (result.items && result.items.length > 0) {
        setAllArticles(result.items);

        // Group articles by maLinhVuc
        const groupedByLinhVuc = result.items.reduce((acc, article) => {
          const key = article.maLinhVuc;
          if (!acc[key]) {
            acc[key] = {
              maLinhVuc: article.maLinhVuc,
              tenLinhVuc: article.tenLinhVuc,
              linhVucId: article.linhVuc,
              articles: [],
            };
          }
          acc[key].articles.push(article);
          return acc;
        }, {});

        // Convert to array and sort by article count
        const tabsData = Object.values(groupedByLinhVuc)
          .filter(group => group.articles.length > 0)
          .sort((a, b) => b.articles.length - a.articles.length);

        console.log('Grouped tabs:', tabsData);

        setTabs(tabsData);

        if (tabsData.length > 0) {
          setSelectedTab(tabsData[0]);
          setArticles(tabsData[0].articles);

          // Start auto-scroll interval after tabs are loaded (only if component is visible)
          if (isVisible) {
            startAutoScroll(tabsData, 5000); // Initial 5s interval
          }
        }
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const startAutoScroll = (tabsData, interval = 5000) => {
    // Clear existing interval if any
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }

    // Start new interval to auto-switch tabs
    autoScrollInterval.current = setInterval(() => {
      setSelectedTab(prevTab => {
        if (!prevTab || tabsData.length === 0) return prevTab;

        // Find current tab index
        const currentIndex = tabsData.findIndex(
          tab => tab.maLinhVuc === prevTab.maLinhVuc,
        );

        // Calculate next index (loop back to 0 if at end)
        const nextIndex = (currentIndex + 1) % tabsData.length;
        const nextTab = tabsData[nextIndex];

        // Update articles for next tab
        setArticles(nextTab.articles);

        // Scroll to center the tab
        scrollToCenter(tabScrollRef, tabRefs.current[nextTab.maLinhVuc]);

        return nextTab;
      });
    }, interval); // Use dynamic interval
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Stop auto-scroll during refresh
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }
    isUserManualChange.current = false; // Reset manual change flag
    loadArticles();
  };

  const handleTabPress = tab => {
    // Mark as user manual change
    isUserManualChange.current = true;

    // Stop auto-scroll when user manually selects a tab
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }

    setSelectedTab(tab);
    setArticles(tab.articles);
    scrollToCenter(tabScrollRef, tabRefs.current[tab.maLinhVuc]);

    // Restart auto-scroll with 30s interval after manual selection (only if component is visible)
    if (isVisible) {
      setTimeout(() => {
        startAutoScroll(tabs, 30000); // 30 seconds for user manual change
      }, 100);
    }
  };

  const handleArticlePress = article => {
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
      Ma: 'ThongTinTheoNhom',
      LienKet:
        'tin-tuc-bai-viet/trang-ngoai/doc-danh-sach-phan-trang?LoaiTinTuc=tintuc&linhVuc=' +
        article.linhVuc,
      linhVucId: article.linhVuc,
    });
  };

  const scrollToCenter = (scrollRef, tabRef) => {
    if (scrollRef.current && tabRef) {
      tabRef.measureLayout(
        scrollRef.current.getInnerViewNode(),
        (x, y, width, height) => {
          scrollRef.current.scrollTo({
            x: x - 100,
            animated: true,
          });
        },
      );
    }
  };

  return (
    <LinearGradient 
      colors={['#fafafa', '#fafafa']} 
      style={styles.container}>
      {/* <LinearGradient
        colors={['#04724D', '#2AB574']}
        start={{x: 0, y: 1}}
        style={{height: insets.top}}
      /> */}

      {/* Tabs */}
      {tabs.length > 0 && (
        <View style={styles.tabsContainer}>
          <ScrollView
            ref={tabScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsContent}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab.maLinhVuc}
                ref={ref => (tabRefs.current[tab.maLinhVuc] = ref)}
                style={[
                  styles.tab,
                  selectedTab?.maLinhVuc === tab.maLinhVuc && styles.tabActive,
                ]}
                onPress={() => handleTabPress(tab)}>
                <Text
                  style={[
                    styles.tabText,
                    selectedTab?.maLinhVuc === tab.maLinhVuc &&
                      styles.tabTextActive,
                  ]}>
                  {tab.tenLinhVuc}
                </Text>
                {/* <View style={styles.tabBadge}></View> */}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Articles List */}
      <FlatList
        data={articles}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={({item, index}) =>
          index === 0 ? (
            <RenderFirstArticle item={item} onPress={handleArticlePress} />
          ) : (
            <RenderArticleCard item={item} onPress={handleArticlePress} />
          )
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#017129" />
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Đang cập nhật thông tin</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#017129"
          />
        }
        contentContainerStyle={styles.listContent}
      />
    </LinearGradient>
  );
};

// Component for first article with full-width 16:9 image
const RenderFirstArticle = ({item, onPress}) => {
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
};

// Component for regular article card with 4:3 image
const RenderArticleCard = ({item, onPress}) => {
  const imageUrl = item.hinhAnh?.path
    ? Global.AssetLinkUrl + item.hinhAnh.path
    : null;

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
      ) : (
        <FastImage
          source={{uri: imageUrl}}
          style={styles.articleImage}
          resizeMode={FastImage.resizeMode.cover}
        />
      )}
      <View style={styles.articleContent}>
        <Text style={styles.articleTitle} numberOfLines={4}>
          {item.tieuDe}
        </Text>
        {/* {item.noiDungTomTat ? (
          <Tthonext style={styles.articleDescription} numberOfLines={2}>
            {item.noiDungTomTat}
          </Text>
        ) : null} */}
        <Text style={styles.articleDate}>
          {Utilities.formatDateTime(item.ngayXuatBan)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Shared element configuration for navigation
ThongTinTheoNhom.sharedElements = route => {
  const item = route.params?.item;
  if (item?.id) {
    return [`item.${item.id}.image`];
  }
  return [];
};

export default ThongTinTheoNhom;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // minHeight: MAX_H * 0.7,
  },
  tabsContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabsContent: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    gap: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    // marginBottom: 10,
    // paddingHorizontal: 12,
    // borderRadius: 20,
    // backgroundColor: '#f5f5f5',
    gap: 2,
  },
  tabActive: {
    // backgroundColor: '#E8F5E9',
    borderBottomWidth: 2,
    borderColor: '#017129',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: '700',
    color: '#017129',
  },
  tabBadge: {
    backgroundColor: '#017129',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
  },
  tabBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  listContent: {
    // paddingBottom: 20,
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
  },
  // First article - full width with 16:9 image
  firstArticle: {
    // marginBottom: 16,
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
    marginTop: 8,
    // marginHorizontal: 8,
    borderRadius: 8,
    overflow: 'hidden',
    // elevation: 1,
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
    fontWeight: '500',
    color: '#494949ff',
    lineHeight: 20,
    marginBottom: 4,
    // textAlign: 'justify',
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
    textAlign: 'right',
    fontStyle: 'italic',
  },
  placeholderImage: {
    width: '100%',
    height: (MAX_W * 9) / 16,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
});
