import React from 'react';
import {Text, View} from 'react-native';
import ImageViewing from 'react-native-image-viewing';

// images: array [{uri: ...}], index: số thứ tự ảnh đang xem, visible, onRequestClose

const ImageViewer = ({
  visible,
  images = [],
  index = 0,
  onRequestClose,
  FooterComponent,
}) => {
  // images: [{uri: ...}]
  return (
    <ImageViewing
      images={images}
      imageIndex={index}
      visible={visible}
      onRequestClose={onRequestClose}
      backgroundColor="rgba(0,0,0,0.95)"
      FooterComponent={({imageIndex}) => (
        <View style={{padding: 16, alignItems: 'center'}}>
          {images.length > 1 && (
            <Text style={{color: '#fff'}}>{`${imageIndex + 1} / ${
              images.length
            }`}</Text>
          )}
        </View>
      )}
    />
  );
};

export default ImageViewer;
