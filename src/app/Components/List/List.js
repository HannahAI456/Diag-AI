import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';

const ReusableFlatList = ({
  data, // Dữ liệu được truyền vào
  onRefresh, // Hàm làm mới khi pull-to-refresh
  refreshing, // Trạng thái làm mới
  loadMoreData, // Hàm để tải thêm dữ liệu
  loadingMore, // Trạng thái đang tải thêm
  renderItem, // Cách render một item (tùy chỉnh để hiển thị thông tin)
  ListEmptyComponent, // Thành phần hiển thị khi danh sách trống
}) => {
  return (
    // <GestureHandlerRootView style={{flex: 1}}>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem} // Hàm render item được truyền vào
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={() =>{ loadMoreData()}} // Gọi hàm khi cuộn đến cuối danh sách
        onEndReachedThreshold={0.8} // Ngưỡng cuộn để tải thêm
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null
        }
        ListEmptyComponent={ListEmptyComponent} // Thành phần khi danh sách trống
      />
    // </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({});

export default ReusableFlatList;
