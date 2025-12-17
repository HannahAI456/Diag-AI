import React, {useMemo, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImageViewing from 'react-native-image-viewing';
import FileViewer from 'react-native-file-viewer';

const FileUpload = ({mode = 'multi', onChange}) => {
  const [files, setFiles] = useState([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const multiple = mode === 'multi';

  const imageItems = useMemo(
    () => files.filter(f => f.isImage).map(f => ({uri: f.preview})),
    [files],
  );

  const setFilesAndEmit = next => {
    setFiles(next);
    onChange?.(next);
  };

  const augment = res => {
    const isImage =
      res.type?.startsWith('image/') ||
      /\.(png|jpe?g|gif|webp|heic|heif)$/i.test(res.name || '');
    const preview = res.fileCopyUri || res.uri; // ưu tiên fileCopyUri -> file://
    return {...res, isImage, preview};
  };

  const uniqBy = (arr, keyFn) => {
    const m = new Map();
    arr.forEach(x => m.set(keyFn(x), x));
    return Array.from(m.values());
  };

  const handlePick = async () => {
    try {
      if (multiple) {
        const picked = DocumentPicker.pickMultiple
          ? await DocumentPicker.pickMultiple({
              type: DocumentPicker.types.allFiles,
              copyTo: 'cachesDirectory',
            })
          : await DocumentPicker.pick({
              type: DocumentPicker.types.allFiles,
              allowMultiSelection: true,
              copyTo: 'cachesDirectory',
            });

        const merged = uniqBy(
          [...files, ...picked.map(augment)],
          f => `${f.name}-${f.size}-${f.fileCopyUri || f.uri || ''}`,
        );
        setFilesAndEmit(merged);
      } else {
        const res = await DocumentPicker.pickSingle({
          type: DocumentPicker.types.allFiles,
          copyTo: 'cachesDirectory',
        });
        setFilesAndEmit([augment(res)]);
      }
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Lỗi', err?.message || 'Không thể chọn file');
      }
    }
  };

  const handlePreview = async file => {
    if (file.isImage) {
      const imagesOnly = files.filter(f => f.isImage);
      const idx = imagesOnly.findIndex(
        f => (f.preview || f.uri) === (file.preview || file.uri),
      );
      setViewerIndex(Math.max(0, idx));
      setViewerVisible(true);
      return;
    }
    // Mở file không phải ảnh
    try {
      // react-native-file-viewer thường muốn path local (không có 'file://')
      const path = (file.fileCopyUri || file.uri || '').replace('file://', '');
      await FileViewer.open(path, {showOpenWithDialog: true});
    } catch (e) {
      Alert.alert(
        'Không thể mở file',
        e?.message || 'Thiết bị không có app phù hợp để mở loại file này.',
      );
    }
  };

  const handleRemove = idx => {
    const next = files.filter((_, i) => i !== idx);
    setFilesAndEmit(next);
  };

  const handleClear = () => setFilesAndEmit([]);

  const getIcon = f => {
    const type = f?.type || '';
    const name = (f?.name || '').toLowerCase();
    const hasExt = exts => exts.some(e => name.endsWith(`.${e}`));

    if (
      type.startsWith('image/') ||
      hasExt(['png', 'jpg', 'jpeg', 'gif', 'webp', 'heic', 'heif'])
    )
      return {name: 'file-image', color: '#4CAF50'};
    if (type.includes('pdf') || hasExt(['pdf']))
      return {name: 'file-pdf-box', color: '#E53935'};
    if (type.startsWith('video/') || hasExt(['mp4', 'mov', 'mkv', 'webm']))
      return {name: 'file-video', color: '#3F51B5'};
    if (
      type.startsWith('audio/') ||
      hasExt(['mp3', 'wav', 'aac', 'm4a', 'flac'])
    )
      return {name: 'file-music', color: '#8E24AA'};
    if (type.includes('spreadsheet') || hasExt(['xls', 'xlsx', 'csv']))
      return {name: 'file-excel-box', color: '#1B5E20'};
    if (type.includes('presentation') || hasExt(['ppt', 'pptx', 'key']))
      return {name: 'file-powerpoint-box', color: '#D84315'};
    if (type.includes('word') || hasExt(['doc', 'docx', 'rtf', 'txt', 'md']))
      return {name: 'file-word-box', color: '#1565C0'};
    if (type.includes('zip') || hasExt(['zip', 'rar', '7z']))
      return {name: 'zip-box', color: '#6D4C41'};
    return {name: 'file-document', color: '#607D8B'};
  };

  const formatBytes = bytes => {
    if (bytes == null) return '—';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  return (
    <View style={{marginBottom: 8}}>
      <TouchableOpacity style={styles.button} onPress={handlePick}>
        <Text style={styles.text}>
          {multiple ? 'Upload Files' : 'Upload File'}
        </Text>
      </TouchableOpacity>

      {files.length > 0 && (
        <View style={styles.listBox}>
          <View style={styles.headerRow}>
            <Text style={styles.heading}>
              Đã chọn: {files.length} {multiple ? 'files' : 'file'}
            </Text>
            <TouchableOpacity
              onPress={handleClear}
              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
              <Icon name="trash-can-outline" size={20} color="#E53935" />
            </TouchableOpacity>
          </View>

          {/* Danh sách dọc – nhấn vào 1 dòng để xem trước */}
          {files.map((f, idx) => (
            <TouchableOpacity
              key={`${f.uri || f.fileCopyUri || f.name}-${idx}`}
              style={styles.itemRow}
              onPress={() => handlePreview(f)}
              activeOpacity={0.7}>
              {f.isImage ? (
                <Image source={{uri: f.preview}} style={styles.preview} />
              ) : (
                <Icon {...getIcon(f)} size={36} />
              )}

              <View style={styles.meta}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {f.name || '(Không tên)'}
                </Text>
                <Text style={styles.fileSize}>{formatBytes(f.size)}</Text>
              </View>

              <TouchableOpacity
                onPress={() => handleRemove(idx)}
                style={styles.removeBtn}
                hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                <Icon name="close" size={18} color="#555" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Image viewer */}
      <ImageViewing
        images={imageItems}
        imageIndex={viewerIndex}
        visible={viewerVisible}
        onRequestClose={() => setViewerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4a90e2',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {color: '#fff', fontWeight: 'bold'},

  listBox: {
    marginTop: 8,
    backgroundColor: '#f1f2f6',
    padding: 10,
    borderRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  heading: {fontWeight: '600', color: '#333'},

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
  },
  preview: {
    width: 48,
    height: 48,
    borderRadius: 6,
    backgroundColor: '#00000010',
  },
  meta: {flex: 1, marginLeft: 10},
  fileName: {fontWeight: 'bold', color: '#222'},
  fileSize: {color: '#888', fontSize: 12, marginTop: 2},
  removeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000010',
    marginLeft: 8,
  },
});

export default FileUpload;
