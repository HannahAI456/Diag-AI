import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import TopNavigation from '../../Components/TopNavigation';
import ReusableFlatList from '../../Components/List/List';
import {showToast} from '../../Components/ToastConfig';
import {RootNavigation} from '../../Common/RootNavigation';
import Axios from 'axios';
import Global from '../../LocalData/Global';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AppColors} from '../../Common/AppColor';
import * as Api from '../../../app/Api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FISHING_ALERT_KEY = '@fishing_alert_subscriber';

const FISHING_API_URL = `${Global.apiTauCa}api/app/tauCaNhatKyGuiThongBao`;

const NotificationScreen = () => {
  // States
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;

  // Fishing alert subscriber data
  const [fishingSubscriber, setFishingSubscriber] = useState(null);

  // Get device ID
  const deviceId = Global.DeviceID;

  // Utility function to merge data safely without duplicates
  const mergeDataSafely = (existingData, newData) => {
    const existingIds = new Set(existingData.map(item => item.id));
    const uniqueNewItems = newData.filter(item => !existingIds.has(item.id));
    return [...existingData, ...uniqueNewItems];
  };

  // Safe key extractor
  const keyExtractor = (item, index) => {
    return item.id;
  };

  // Load fishing subscriber from AsyncStorage
  const loadFishingSubscriber = async () => {
    try {
      const storedData = await AsyncStorage.getItem(FISHING_ALERT_KEY);
      if (storedData) {
        const parsed = JSON.parse(storedData);
        setFishingSubscriber(parsed);
        return parsed;
      }
      return null;
    } catch (error) {
      console.error('Error loading fishing subscriber:', error);
      return null;
    }
  };

  // Fetch fishing notifications
  const fetchFishingNotifications = async subscriber => {
    if (
      !subscriber ||
      !subscriber.vesselIds ||
      subscriber.vesselIds.length === 0
    ) {
      return [];
    }

    try {
      // Build query params with multiple SoDangKy
      const params = new URLSearchParams();
      subscriber.vesselIds.forEach(vesselId => {
        params.append('SoDangKy', vesselId);
      });

      const url = `${FISHING_API_URL}?${params.toString()}`;
      const response = await Axios.get(url, {
        headers: {
          Authorization: `Bearer ${Global.StaticTokenTauCa}`,
        },
      });

      if (response.data && response.data.items) {
        // Transform fishing notifications to match our notification format
        return response.data.items.map(item => {
          // Filter chiTietTheoSoDangKy to only show saved vesselIds
          const savedVesselDetails =
            item.chiTietTheoSoDangKy?.filter(detail =>
              subscriber.vesselIds.includes(detail.soDangKy),
            ) || [];

          // Get vessel info string - include tenTau if available
          const vesselInfo = savedVesselDetails
            .map(detail => {
              const parts = [detail.soDangKy];
              if (detail.tenTau) parts.push(detail.tenTau);
              if (detail.soDienThoai) parts.push(detail.soDienThoai);
              return parts.join(' - ');
            })
            .join('\n');

          return {
            id: `fishing_${item.id}`,
            title: item.tieuDe,
            content: item.noiDungThongBao,
            receivedDate: item.ngayGui,
            seen: true, // Mark as seen by default
            type: 'fishing_notification',
            originalData: item,
            vesselInfo: vesselInfo,
            savedVesselDetails: savedVesselDetails,
          };
        });
      }
      return [];
    } catch (error) {
      console.error('Fetch fishing notifications error:', error);
      return [];
    }
  };

  // API call function for regular notifications
  const fetchNotifications = async (page = 0, isRefresh = false) => {
    try {
      const url = `${Global.API_URL}/api/app/notification-diary`;
      const params = {
        deviceId: deviceId,
        SkipCount: page * pageSize,
        MaxResultCount: pageSize,
      };

      const headers = {};
      if (Global.accessToken) {
        headers.Authorization = `Bearer ${Global.accessToken}`;
      }

      const response = await Axios.get(url, {params, headers});

      return {
        items: response.data.items || [],
        totalCount: response.data.totalCount || 0,
        hasMore: (page + 1) * pageSize < (response.data.totalCount || 0),
      };
    } catch (error) {
      console.error('Fetch notifications error:', error);
      throw error;
    }
  };

  // Merge and sort all notifications
  const mergeAllNotifications = (
    regularNotifications,
    fishingNotifications,
  ) => {
    const allNotifications = [...regularNotifications, ...fishingNotifications];

    // Sort by date (newest first)
    allNotifications.sort((a, b) => {
      const dateA = new Date(a.receivedDate);
      const dateB = new Date(b.receivedDate);
      return dateB - dateA;
    });

    return allNotifications;
  };

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load fishing subscriber first
      const subscriber = await loadFishingSubscriber();

      // Fetch both types of notifications in parallel
      const [regularResult, fishingNotifications] = await Promise.all([
        fetchNotifications(0),
        fetchFishingNotifications(subscriber),
      ]);

      // Merge and sort
      const mergedData = mergeAllNotifications(
        regularResult.items,
        fishingNotifications,
      );

      setData(mergedData);
      setTotalCount(regularResult.totalCount + fishingNotifications.length);
      setHasMore(regularResult.hasMore);
      setCurrentPage(0);
    } catch (error) {
      console.error('Load initial data error:', error);
      showToast('error', 'Đã có lỗi xảy ra vui lòng thử lại sau');
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const subscriber = await loadFishingSubscriber();

      const [regularResult, fishingNotifications] = await Promise.all([
        fetchNotifications(0, true),
        fetchFishingNotifications(subscriber),
      ]);

      const mergedData = mergeAllNotifications(
        regularResult.items,
        fishingNotifications,
      );

      setData(mergedData);
      setTotalCount(regularResult.totalCount + fishingNotifications.length);
      setHasMore(regularResult.hasMore);
      setCurrentPage(0);
    } catch (error) {
      console.error('Refresh error:', error);
      showToast('error', 'Đã có lỗi xảy ra vui lòng thử lại sau');
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Load more data (only for regular notifications)
  const loadMoreData = async () => {
    if (loadingMore || !hasMore || loading) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await fetchNotifications(nextPage);

      // Only merge regular notifications for pagination
      const existingRegular = data.filter(
        item => item.type !== 'fishing_notification',
      );
      const existingFishing = data.filter(
        item => item.type === 'fishing_notification',
      );

      const newRegular = mergeDataSafely(existingRegular, result.items);
      const mergedData = mergeAllNotifications(newRegular, existingFishing);

      setData(mergedData);
      setHasMore(result.hasMore);
      setCurrentPage(nextPage);

      console.log(
        `Loaded page ${nextPage}: ${result.items.length} new items, total: ${mergedData.length}`,
      );
    } catch (error) {
      console.error('Load more error:', error);
      showToast('error', 'Đã có lỗi xảy ra vui lòng thử lại sau');
    } finally {
      setLoadingMore(false);
    }
  };

  // Handle notification press
  const handleNotificationPress = async item => {
    console.log('Notification pressed:', item);

    if (item.type === 'fishing_notification') {
      // Handle fishing notification press - có thể navigate đến màn hình chi tiết
      return;
    }

    switch (item.type) {
      case 'thong-bao-tin-tuc':
        try {
          const url =
            Global.API_URL + '/api/app/tin-tuc-bai-viet/' + item.detailId;
          const res = await Api.getApiWithAccessToken(
            url,
            {},
            Global.accessToken,
          );

          RootNavigation.navigate('ChiTietBaiViet', {
            item: {id: item?.detailId},
            Ma: 'TinTucNhomTin',
            LienKet:
              'tin-tuc-bai-viet/trang-ngoai/doc-danh-sach-phan-trang?LoaiTinTuc=tintuc&SkipCount=0&MaxResultCount=10&linhVuc=' +
              res.data?.linhVuc +
              '&danhSachChuDe=' +
              res.data?.newsTopic +
              '&duongDanChuDe=',
            useShare: false,
          });
        } catch (error) {
          console.log('Error fetching article detail:', error);
        }
        break;
      default:
        break;
    }
  };

  // Format date
  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    }
  };

  // Render notification item
  const renderItem = ({item}) => {
    const isFishingNotification = item.type === 'fishing_notification';

    return (
      <TouchableOpacity
        style={[styles.itemContainer]}
        onPress={() => handleNotificationPress(item)}
        activeOpacity={0.7}>
        {/* Icon */}
        <View
          style={[
            styles.iconContainer,
            !item.seen && styles.unreadIconContainer,
            isFishingNotification && styles.fishingIconContainer,
          ]}>
          <Icon
            name={isFishingNotification ? 'directions-boat' : 'notifications'}
            size={24}
            color={
              isFishingNotification
                ? '#1976D2'
                : !item.seen
                ? AppColors.MainColor
                : '#999'
            }
          />
        </View>

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={[styles.title, !item.seen && styles.unreadTitle]}>
            {item.title}
          </Text>
          <Text style={styles.content} numberOfLines={2}>
            {item.content}
          </Text>

          {/* Show vessel info for fishing notifications */}
          {isFishingNotification && item.vesselInfo && (
            <View style={styles.vesselInfoContainer}>
              <Icon name="anchor" size={14} color="#666" />
              <Text style={styles.vesselInfoText} numberOfLines={2}>
                {item.vesselInfo}
              </Text>
            </View>
          )}

          <Text style={styles.date}>{formatDate(item.receivedDate)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Empty component
  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="notifications-none" size={64} color="#CCC" />
      <Text style={styles.emptyTitle}>Không có dữ liệu</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopNavigation title="Thông báo" navigation={RootNavigation} />

      {/* List */}
      <ReusableFlatList
        data={data}
        renderItem={renderItem}
        onRefresh={onRefresh}
        refreshing={refreshing}
        loadMoreData={loadMoreData}
        loadingMore={loadingMore}
        ListEmptyComponent={renderEmpty}
        keyExtractor={keyExtractor}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  statsContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  hasMoreText: {
    fontSize: 12,
    color: '#666',
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unreadItem: {
    backgroundColor: '#F0F8FF',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  unreadIconContainer: {
    backgroundColor: '#E8F5E9',
  },
  fishingIconContainer: {
    backgroundColor: '#E3F2FD',
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  unreadTitle: {
    fontWeight: '700',
    color: '#000',
  },
  content: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  vesselInfoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  vesselInfoText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 6,
    flex: 1,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: AppColors.MainColor,
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8a8a8aff',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
