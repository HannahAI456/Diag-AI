import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {AppColors} from '../Common/AppColor';
import {MAX_H, MAX_W} from '../Common/GlobalStyles';
import {useNavigation} from '@react-navigation/native';

const VerticalFlatlist = ({data, type}) => {
  const navigation = useNavigation();
  const Item = ({item, navigate, backgroundColor, textColor}) => (
    <TouchableOpacity
      onPress={() =>
        type === 'Tour'
          ? navigation.navigate('TourDetail')
          : navigation.navigate('GalleryDetail')
      }
      style={styles.card}>
      <Image
        resizeMode="cover"
        style={styles.image_Main}
        source={{uri: item.image}}
      />
      <View
        style={{
          height: 50,
          width: '100%',
          justifyContent: 'center',
          // marginHorizontal: 3,
        }}>
        <Text style={[styles.titleCard]}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  );
  return (
    <FlatList
      numColumns={2}
      scrollEnabled={false}
      data={data}
      renderItem={Item}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.flatListContent}
    />
  );
};

export default VerticalFlatlist;
const styles = StyleSheet.create({
  container: {flex: 1, paddingTop: 10},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: AppColors.Gray,
    paddingVertical: 15,
  },
  image_Main: {
    // width: MAX_W * 0.4,
    height: MAX_H * 0.15,
    borderTopRightRadius: 7,
    borderTopLeftRadius: 7,
  },
  card: {
    // width: MAX_W * 0.4 - 40,
    width: MAX_W * 0.5 - 20,

    borderRadius: 7,
    backgroundColor: 'white',
    margin: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  titleCard: {
    marginLeft: 5,
    fontSize: 15,
    color: AppColors.titleColor,
    maxWidth: MAX_W * 0.5 - 35,
    fontWeight: 'bold',
  },
  flatListContent: {
    width: '100%',
    // backgroundColor: 'red',
    // width: MAX_W - 20,
    // flexDirection: 'column',
    // alignItems: 'center', // Center items horizontally
    justifyContent: 'space-between',
  },
});
