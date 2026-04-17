import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import RNFileViewer from 'react-native-file-viewer';
import RNBlobUtil from 'react-native-blob-util';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewer from './ImageViewer';

const FileViewer = React.forwardRef(
  ({fileName, filePath, compact = false, style, iconColor}, ref) => {
    const [downloading, setDownloading] = React.useState(false);
    const [imageViewerVisible, setImageViewerVisible] = React.useState(false);

    const getExt = React.useCallback(() => {
      const src = (fileName || filePath || '').split('?')[0].split('#')[0];
      const parts = src.split('.');
      if (parts.length <= 1) return '';
      return parts.pop().toLowerCase();
    }, [fileName, filePath]);

    const ext = getExt();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(ext);

    const getIconMeta = React.useCallback(ext => {
      switch (ext) {
        case 'pdf':
          return {
            icon: 'file-document-outline',
            color: '#E74C3C',
            bg: '#FDECEA',
          };
        case 'doc':
        case 'docx':
          return {icon: 'file-word', color: '#2A5699', bg: '#EAF1FD'};
        case 'xls':
        case 'xlsx':
          return {icon: 'file-excel', color: '#217346', bg: '#EAF7EE'};
        case 'ppt':
        case 'pptx':
          return {icon: 'file-powerpoint', color: '#D24726', bg: '#FEF0EA'};
        case 'csv':
          return {icon: 'file-table-box', color: '#1B5E20', bg: '#EAF7EE'};
        case 'txt':
          return {
            icon: 'file-document-outline',
            color: '#616161',
            bg: '#F3F4F6',
          };
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
          return {icon: 'file-image', color: '#8E44AD', bg: '#F5ECFF'};
        case 'mp3':
        case 'wav':
        case 'm4a':
          return {icon: 'file-music', color: '#6C5CE7', bg: '#EFEAFF'};
        case 'mp4':
        case 'mov':
        case 'avi':
        case 'mkv':
          return {icon: 'file-video', color: '#00BCD4', bg: '#E6FAFD'};
        case 'zip':
        case 'rar':
        case '7z':
          return {icon: 'folder-zip', color: '#FF8F00', bg: '#FFF4E5'};
        case 'apk':
          return {icon: 'android', color: '#34A853', bg: '#EAF7EE'};
        case 'json':
        case 'js':
        case 'ts':
        case 'css':
        case 'scss':
        case 'xml':
        case 'html':
          return {icon: 'file-code', color: '#2D9CDB', bg: '#EAF4FD'};
        default:
          return {icon: 'file-document', color: '#0984e3', bg: '#EAF4FD'};
      }
    }, []);

    const {icon, color, bg} = getIconMeta(getExt());

    const handleOpen = async () => {
      if (!filePath) {
        Alert.alert('Lỗi', 'Không tìm thấy đường dẫn file!');
        return;
      }

      // Nếu là ảnh, mở ImageViewer
      if (isImage) {
        setImageViewerVisible(true);
        return;
      }

      let localPath = filePath;

      // Nếu là URL thì tải về cache
      if (/^https?:\/\//.test(filePath)) {
        try {
          setDownloading(true);
          const cleaned = filePath.split('?')[0].split('#')[0];
          const ext = cleaned.includes('.') ? cleaned.split('.').pop() : 'tmp';
          const destPath = `${
            RNBlobUtil.fs.dirs.CacheDir
          }/${Date.now()}.${ext}`;
          const res = await RNBlobUtil.config({path: destPath}).fetch(
            'GET',
            filePath,
          );
          if (res && (await RNBlobUtil.fs.exists(destPath))) {
            localPath = destPath;
          } else {
            throw new Error('Tải file thất bại!');
          }
        } catch (e) {
          setDownloading(false);
          Alert.alert('Không thể tải file', e?.message || 'Lỗi không xác định');
          return;
        }
        setDownloading(false);
      }

      try {
        await RNFileViewer.open(localPath, {showOpenWithDialog: true});
      } catch (e) {
        console.log('Lỗi mở file:', e);
        Alert.alert('Không thể mở file', e?.message || 'Lỗi không xác định');
      }
    };

    // expose open() to parent via ref
    React.useImperativeHandle(ref, () => ({open: handleOpen}));

    // Render cho ảnh - hiển thị preview
    if (isImage) {
      if (compact) {
        return (
          <>
            <TouchableOpacity
              style={[styles.compactImageContainer, style]}
              onPress={handleOpen}>
              <Image
                source={{uri: filePath}}
                style={styles.compactImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <ImageViewer
              visible={imageViewerVisible}
              images={[{uri: filePath}]}
              index={0}
              onRequestClose={() => setImageViewerVisible(false)}
            />
          </>
        );
      }

      return (
        <>
          <TouchableOpacity
            style={[styles.imageContainer, style]}
            onPress={handleOpen}>
            <Image
              source={{uri: filePath}}
              style={styles.imagePreview}
              resizeMode="cover"
            />
            <View style={styles.imageOverlay}>
              <Icon name="eye" size={24} color="#fff" />
            </View>
            {fileName && (
              <Text numberOfLines={1} style={styles.imageFileName}>
                {fileName}
              </Text>
            )}
          </TouchableOpacity>
          <ImageViewer
            visible={imageViewerVisible}
            images={[{uri: filePath}]}
            index={0}
            onRequestClose={() => setImageViewerVisible(false)}
          />
        </>
      );
    }

    // Render cho file thông thường
    if (compact) {
      return (
        <TouchableOpacity
          style={[styles.compactContainer, {backgroundColor: bg}, style]}
          onPress={handleOpen}
          disabled={downloading}>
          {downloading ? (
            <ActivityIndicator
              size="small"
              color={'white'}
              // style={{marginLeft: 6}}
            />
          ) : (
            <Icon name={icon} size={24} color={iconColor ? iconColor : color} />
          )}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={[styles.container, style]}
        onPress={handleOpen}
        disabled={downloading}>
        <Icon name={icon} size={24} color={color} />
        <Text numberOfLines={1} style={styles.text}>
          {fileName}
        </Text>
        {downloading && (
          <ActivityIndicator
            size="small"
            color={color}
            style={{marginLeft: 8}}
          />
        )}
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 6,
    marginVertical: 4,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 13,
    marginLeft: 8,
    color: 'gray',
    fontWeight: 'bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  compactContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  // Image styles
  imageContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 4,
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
  },
  imageOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageFileName: {
    padding: 8,
    fontSize: 12,
    color: '#666',
    backgroundColor: '#fff',
  },
  compactImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
});

export default FileViewer;
