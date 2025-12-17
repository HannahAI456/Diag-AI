import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {AppColors} from '../Common/AppColor';
const TitleMain = ({content}) => {
  return (
    <View>
      <Text style={styles.title}>{content}</Text>
    </View>
  );
};

export default TitleMain;

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.Gray,
    paddingVertical: 15,
  },
});
