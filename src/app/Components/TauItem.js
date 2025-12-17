import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CollapsibleView from './CollapsibleView';

const {width} = Dimensions.get('window');

const TauItem = ({item, onPress, onDelete, onFavorite, type}) => {
  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTongDungTich = dungTich => {
    return dungTich ? `${dungTich.toFixed(1)} m³` : 'N/A';
  };

  const formatCongSuat = congSuat => {
    return congSuat ? `${congSuat} CV` : 'N/A';
  };

  // Kiểm tra điều kiện để đổi màu
  const hasAttachment = () => {
    // Nếu là cấp phép, kiểm tra tapTinDinhKem
    if (type === 'capphep') {
      return (
        item?.tapTinDinhKem &&
        Array.isArray(item?.tapTinDinhKem) &&
        item?.tapTinDinhKem.length > 0
      );
    }
    // Các loại khác kiểm tra hinhAnhTau
    return (
      item?.hinhAnhTau &&
      Array.isArray(item?.hinhAnhTau) &&
      item?.hinhAnhTau.length > 0
    );
  };
  const fullAddress = [
    item.chuTau_TenAp,
    item.chuTau_TenXa,
    item.chuTau_TenHuyen,
  ]
    .filter(Boolean)
    .join(', ');
  return (
    <TouchableOpacity
      style={[
        styles.container,
        hasAttachment() && {backgroundColor: '#e8f3ffff'},
      ]}
      onPress={() => onPress?.(item)}
      activeOpacity={0.7}>
      <View style={styles.mainContent}>
        {/* Icon tàu bên trái */}
        <View style={styles.iconContainer}>
          <Icon name="ferry" size={40} color="#007AFF" />
        </View>

        {/* Thông tin chính */}
        <View style={styles.infoContainer}>
          <Text style={styles.chuTau} numberOfLines={1}>
            Chủ tàu: {item.chuTau_Ten || 'Không có thông tin'}
          </Text>
          <Text style={styles.soDangKy} numberOfLines={1}>
            Số ĐK: {item.soDangKy || 'N/A'}
          </Text>
          {(item.ngayDangKy || item.ngayCapSoDangKiem) && (
            <Text style={styles.ngayDangKy}>
              {(() => {
                if (item.ngayDangKy)
                  return `Ngày đăng ký: ${formatDate(item.ngayDangKy)}`;
                if (item.ngayCapSoDangKiem)
                  return `Ngày cấp số đăng kiểm: ${formatDate(
                    item.ngayCapSoDangKiem,
                  )}`;
                return '';
              })()}
            </Text>
          )}
          <Text style={styles.diaChi} numberOfLines={1}>
            Địa chỉ:{' '}
            {fullAddress ||
              item.chuTau_DiaChiFull ||
              item.chuTau_DiaChi ||
              'N/A'}
          </Text>
        </View>

        {/* Icon mũi tên bên phải */}
        <View style={styles.arrowContainer}>
          <Icon name="chevron-right" size={24} color="#999" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 5,
    padding: 8,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 3,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F0F8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  chuTau: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  soDangKy: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 3,
  },
  ngayDangKy: {
    fontSize: 13,
    color: '#666',
    marginBottom: 3,
  },
  diaChi: {
    fontSize: 13,
    color: '#999',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 8,
  },
});

export default TauItem;
