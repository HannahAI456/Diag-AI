import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const Table = ({columns = [], data = []}) => (
  <View style={styles.container}>
    <View style={styles.headerRow}>
      {columns.map((col, idx) => (
        <Text key={idx} style={[styles.cell, styles.headerCell]}>
          {col}
        </Text>
      ))}
    </View>
    {data.map((row, i) => (
      <View key={i} style={styles.dataRow}>
        {row.map((cell, j) => (
          <Text key={j} style={styles.cell}>
            {cell}
          </Text>
        ))}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  headerRow: {flexDirection: 'row', backgroundColor: '#f5f5f5'},
  dataRow: {flexDirection: 'row', backgroundColor: '#fff'},
  cell: {
    flex: 1,
    padding: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    textAlign: 'center',
  },
  headerCell: {fontWeight: 'bold', color: '#333'},
});

export default Table;
