// import React, {useRef} from 'react';
// import {View, StyleSheet, Text, ScrollView, PermissionsAndroid} from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import {launchImageLibrary} from 'react-native-image-picker';
// import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';


// /**
//  * RichTextEditor component sử dụng react-native-pell-rich-editor
//  * Props:
//  * - value: nội dung HTML
//  * - onChange: (html) => void
//  * - placeholder: string
//  * - style, editorStyle, toolbarStyle, ...
//  * - disabled: boolean
//  */
// const RichTextEditor = ({
//   value = '',
//   onChange,
//   placeholder = 'Nhập nội dung...',
//   style,
//   editorStyle,
//   toolbarStyle,
//   disabled = false,
// }) => {
//   const richText = useRef();
//   const onPressAddImage = () => {
//     handleSelectImage();
//   };
//   const requestPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const permissions = [
//           PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//         ];

//         const granted = await PermissionsAndroid.requestMultiple(permissions);
//         const allGranted = Object.values(granted).every(
//           status => status === PermissionsAndroid.RESULTS.GRANTED,
//         );

//         if (!allGranted) {
//           Alert.alert(
//             'Quyền bị từ chối',
//             'Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh.',
//             [
//               {text: 'Đóng', style: 'cancel'},
//               {text: 'Mở cài đặt', onPress: () => Linking.openSettings()},
//             ],
//           );
//           return false;
//         }
//         return true;
//       } catch (err) {
//         console.warn('Lỗi yêu cầu quyền:', err);
//         return false;
//       }
//     }
//     return true; // iOS handles permissions automatically
//   };
//   const handleSelectImage = async () => {
//     const hasPermission = await requestPermission();
//     if (!hasPermission) {
//       Alert.alert(
//         'Quyền bị từ chối',
//         'Ứng dụng cần quyền truy cập thư viện ảnh để chọn ảnh.',
//         [
//           {text: 'Đóng', style: 'cancel'},
//           {text: 'Mở Cài đặt', onPress: () => Linking.openSettings()},
//         ],
//       );
//       return;
//     }

//     const options = {
//       mediaType: 'photo',
//       quality: 0.7,
//       maxWidth: 500,
//       maxHeight: 500,
//       includeBase64: true, // Thêm tùy chọn để lấy dữ liệu Base64
//     };

//     try {
//       const result = await launchImageLibrary(options);
//       if (result.didCancel) {
//         console.log('Người dùng hủy chọn ảnh');
//         return;
//       }

//       if (result.errorCode) {
//         Alert.alert('Lỗi', `Không thể chọn ảnh: ${result.errorMessage}`);
//         return;
//       }

//       const image = result.assets[0];
//       setSelectedImage(image);
//       setConfirmAvatarModalVisible(true); // Hiển thị modal xác nhận
//     } catch (error) {
//       console.log('Lỗi khi chọn ảnh:', error);
//       Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.');
//     }
//   };
//   const iconMap = {
//     [actions?.heading1]: ({tintColor}) => (
//       <Text style={[styles.tib, {color: tintColor}]}>H1</Text>
//     ),
//     [actions?.heading2]: ({tintColor}) => (
//       <Text style={[styles.tib, {color: tintColor}]}>H2</Text>
//     ),
//     [actions?.heading3]: ({tintColor}) => (
//       <Text style={[styles.tib, {color: tintColor}]}>H3</Text>
//     ),
//     [actions?.heading4]: ({tintColor}) => (
//       <Text style={[styles.tib, {color: tintColor}]}>H4</Text>
//     ),
//     [actions?.heading5]: ({tintColor}) => (
//       <Text style={[styles.tib, {color: tintColor}]}>H5</Text>
//     ),
//     [actions?.heading6]: ({tintColor}) => (
//       <Text style={[styles.tib, {color: tintColor}]}>H6</Text>
//     ),
//     [actions?.setStrikethrough]: ({tintColor}) => (
//       <FontAwesome name="strikethrough" size={16} color={tintColor} />
//     ),
//     [actions?.setSubscript]: ({tintColor}) => (
//       <FontAwesome name="subscript" size={16} color={tintColor} />
//     ),
//     [actions?.setSuperscript]: ({tintColor}) => (
//       <FontAwesome name="superscript" size={16} color={tintColor} />
//     ),
//     [actions?.code]: ({tintColor}) => (
//       <FontAwesome name="code" size={16} color={tintColor} />
//     ),
//     [actions?.line]: ({tintColor}) => (
//       <Text style={[styles.tib, {color: tintColor}]}>—</Text>
//     ),
//     [actions?.blockquote]: ({tintColor}) => (
//       <FontAwesome name="quote-right" size={16} color={tintColor} />
//     ),
//   };
//   return (
//     <View style={[styles.container, style]}>
//       <ScrollView
//         horizontal={true}
//         showsHorizontalScrollIndicator={false}
//         style={styles.toolbarScroll}>
//         <RichToolbar
//           editor={richText}
//           actions={[
//             actions.setBold,
//             actions.setItalic,
//             actions.setUnderline,
//             actions.setStrikethrough,
//             actions.heading1,
//             actions.heading2,
//             actions.heading3,
//             actions.insertBulletsList,
//             actions.insertOrderedList,
//             actions.checkboxList,
//             actions.alignLeft,
//             actions.alignCenter,
//             actions.alignRight,
//             actions.alignFull,
//           ]}
//         //   iconMap={iconMap}
//           style={styles.toolbar}
//         />
//       </ScrollView>

//       <ScrollView
//         horizontal={true}
//         showsHorizontalScrollIndicator={false}
//         style={styles.toolbarScroll}>
//         <RichToolbar
//           editor={richText}
//           actions={[
//             actions.insertLink,
//             actions.insertImage,
//             // actions.insertTable,
//             actions.blockquote,
//             actions.code,
//             actions.line,
//             actions.indent,
//             actions.outdent,
//             actions.setSubscript,
//             actions.setSuperscript,
//             actions.undo,
//             actions.redo,
//             actions.removeFormat,
//           ]}
//         //   iconMap={iconMap}
//           style={styles.toolbar}
//           onPressAddImage={onPressAddImage}
//         />
//       </ScrollView>
//       <RichEditor
//         ref={richText}
//         initialContentHTML={value}
//         onChange={onChange}
//         placeholder={placeholder}
//         editorStyle={editorStyle}
//         disabled={disabled}
//         style={styles.editor}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//     marginBottom: 16,
//     overflow: 'visible',
//   },
//   editor: {
//     // minHeight: 120,
//     padding: 8,
//     zIndex: 10,
//   },
//   toolbar: {
//     borderTopWidth: 1,
//     borderColor: '#eee',
//     backgroundColor: '#fafbfc',
//   },
// });

// export default RichTextEditor;


import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const RichTextEditor = () => {
  return (
    <View>
      <Text>RichTextEditor</Text>
    </View>
  )
}

export default RichTextEditor

const styles = StyleSheet.create({})