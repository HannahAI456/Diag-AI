import React, {useState, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // <— thêm
import {AppColors} from '../Common/AppColor';

const MyDateField = ({
  label,
  mode = 'date',
  theme = 'light',
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(value ?? null);

  // Sync with external value
  useEffect(() => {
    setDate(value ?? null);
  }, [value]);

  const handleConfirm = d => {
    setOpen(false);
    setDate(d);
    onChange?.(d);
  };

  const iconName =
    mode === 'time' ? 'clock-time-four-outline' : 'calendar-month-outline';

  // Hiển thị text
  const getDisplayText = () => {
    if (!date) return 'Chọn ngày';

    if (mode === 'date') {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } else if (mode === 'time') {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return date?.toLocaleString('vi-VN');
  };

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={() => setOpen(true)}>
        <Text style={[styles.text, !date && styles.placeholderText]}>
          {getDisplayText()}
        </Text>

        <View style={styles.right}>
          <Icon name={iconName} size={25} color="#6B7280" />
        </View>
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={date || new Date()} // date null thì picker vẫn cần một giá trị
        mode={mode}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
        theme={theme}
        confirmText="Đồng ý"
        cancelText="Hủy"
        dividerColor={AppColors.MainColor}
        locale="vi"
        title="Chọn ngày"
        is24hourSource="locale"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {marginBottom: 0},
  label: {marginBottom: 6, color: '#374151', fontWeight: '600'},
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // để text trái, icon phải
  },
  text: {color: '#1a1a1a', fontWeight: '500', fontSize: 15},
  placeholderText: {color: '#999', fontWeight: '400'},
  right: {flexDirection: 'row', alignItems: 'center', gap: 4}, // nhóm 2 icon
});

export default MyDateField;
