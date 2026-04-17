import React from 'react';
import {View, ActivityIndicator, RefreshControl, Text} from 'react-native';
import Animated from 'react-native-reanimated';
import * as Api from '../../Api/Api';
import Global from '../../LocalData/Global';

/**
 * ApiList
 * Props:
 * - item: menu/tab item (expects item.LienKet to build endpoint)
 * - renderItem, keyExtractor
 * - fallbackData: array to render when no LienKet provided
 * - pageSize (optional)
 * - listProps: extra props passed to FlatList
 */
const ApiList = ({
  item,
  renderItem,
  keyExtractor,
  fallbackData = [],
  pageSize = 10,
  listProps = {},
}) => {
  const [data, setData] = React.useState(fallbackData || []);
  const [page, setPage] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [hasMore, setHasMore] = React.useState(true);

  const endpoint = React.useMemo(() => {
    if (item && item.LienKet) return '/api/app/' + item.LienKet;
    return null;
  }, [item]);

  const parseResponse = res => {
    // Try common shapes: array, { items: [...], totalCount }, {data: [...]} etc.
    if (!res) return {items: [], total: 0};
    const payload = res.data ?? res;
    if (Array.isArray(payload)) return {items: payload, total: payload.length};
    if (Array.isArray(payload.items)) return {items: payload.items, total: payload.totalCount ?? payload.items.length};
    if (Array.isArray(payload.data)) return {items: payload.data, total: payload.totalCount ?? payload.data.length};
    // fallback: try to find first array value
    const arr = Object.values(payload).find(v => Array.isArray(v));
    if (arr) return {items: arr, total: arr.length};
    return {items: [], total: 0};
  };

  const fetchPage = async (p = 1, concat = false) => {
    if (!endpoint) return;
    try {
      if (p === 1) setLoading(true);
      else setLoadingMore(true);

      // Use Api.getApi which prepends Global.API_URL
      const params = {page: p, pageSize};
      const res = await Api.getApi(endpoint, params, true);
      console.log('ApiList fetch', endpoint, params, res);
      const {items, total} = parseResponse(res);
      if (concat) setData(prev => [...prev, ...items]);
      else setData(items);
      const received = items.length;
      // simple hasMore heuristic
      setHasMore(received === pageSize && (received + (concat ? data.length : 0) < (total || Infinity)));
      setPage(p);
    } catch (error) {
      console.warn('ApiList fetch error', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  React.useEffect(() => {
    if (!endpoint) {
      // use fallbackData
      setData(fallbackData || []);
      setHasMore(false);
      return;
    }
    // initial load
    fetchPage(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint]);

  const onRefresh = React.useCallback(() => {
    if (!endpoint) return;
    setRefreshing(true);
    fetchPage(1, false);
  }, [endpoint]);

  const onEndReached = () => {
    if (!endpoint || loadingMore || !hasMore) return;
    fetchPage(page + 1, true);
  };

  // Use Animated.FlatList to keep behavior similar to caller
  const AnimatedFlatList = Animated.FlatList;

  return (
    <AnimatedFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      onEndReachedThreshold={0.5}
      onEndReached={onEndReached}
      ListFooterComponent={
        loadingMore ? (
          <View style={{padding: 12, alignItems: 'center'}}>
            <ActivityIndicator />
          </View>
        ) : null
      }
      // {...listProps}
    />
  );
};

export default ApiList;
