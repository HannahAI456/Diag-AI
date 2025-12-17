import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import DatePicker from 'react-native-date-picker';

const QuickDatePicker = () => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date()); // ngày hiện tại
  const [year, setYear] = useState('1990'); // input quick jump

  const addYears = (d, n) => {
    const nd = new Date(d);
    nd.setFullYear(nd.getFullYear() + n);
    return nd;
  };

  const jumpToYear = () => {
    const y = Math.max(1900, Math.min(2100, parseInt(year || '', 10)));
    if (!isNaN(y)) setDate(new Date(y, 0, 1));
    setOpen(true); // mở picker ngay tại năm vừa set
  };

  return (
    <View>
      {/* Quick actions */}
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => setDate(addYears(date, -10))}>
          <Text>-10 năm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => setDate(addYears(date, -1))}>
          <Text>-1 năm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chip}
          onPress={() => setDate(new Date())}>
          <Text>Hôm nay</Text>
        </TouchableOpacity>
      </View>

      {/* Jump tới năm cụ thể */}
      <View style={styles.row}>
        <TextInput
          value={year}
          onChangeText={setYear}
          placeholder="Nhập năm (vd 1990)"
          keyboardType="number-pad"
          style={styles.input}
        />
        <TouchableOpacity style={styles.btn} onPress={jumpToYear}>
          <Text style={{color: '#fff'}}>Chọn</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.btn, {marginTop: 10}]}
        onPress={() => setOpen(true)}>
        <Text style={{color: '#fff'}}>Mở DatePicker</Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        minimumDate={new Date(1900, 0, 1)}
        maximumDate={new Date()} // tuỳ nhu cầu
        onConfirm={d => {
          setOpen(false);
          setDate(d);
        }}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', marginTop: 8},
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: '#eee',
    marginRight: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 8,
    backgroundColor: '#fff',
  },
  btn: {
    backgroundColor: '#4a90e2',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginLeft: 8,
  },
});
