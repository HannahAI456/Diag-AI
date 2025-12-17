// ActionMenu.tsx
import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const {width: SCREEN_W} = Dimensions.get('window');

export default function ActionMenu({
  title = 'Chọn tác vụ',
  items = [],
  width = 220,
  align = 'left', // 'left' | 'right'
}) {
  const triggerRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [anchor, setAnchor] = useState({x: 0, y: 0, w: 0, h: 0});

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({x, y, w, h});
      setVisible(true);
    });
  };

  const close = () => setVisible(false);

  // vị trí menu, tự né mép màn hình
  const left =
    align === 'right'
      ? Math.max(8, anchor.x + anchor.w - width)
      : Math.max(8, Math.min(anchor.x, SCREEN_W - width - 8));
  const top = anchor.y + anchor.h + 8;

  return (
    <>
      {/* Nút trigger */}
      <Pressable ref={triggerRef} onPress={open} style={styles.trigger}>
        <Ionicons name="list-outline" size={16} color="#16a34a" />
        <Text style={styles.triggerText}>{title}</Text>
      </Pressable>

      {/* Popover */}
      <Modal
        visible={visible}
        transparent
        // animationType="fade"
        onRequestClose={close}>
        {/* overlay bắt outside-tap */}
        <TouchableWithoutFeedback onPress={close}>
          <View style={StyleSheet.absoluteFill} />
        </TouchableWithoutFeedback>

        {/* hộp menu */}
        <View style={[styles.menu, {top, left, width}]}>
          {/* mũi tên */}
          <View style={styles.arrowWrap}>
            <View style={styles.arrow} />
          </View>

          {items.map((it, idx) => (
            <Pressable
              key={idx}
              android_ripple={{color: 'rgba(0,0,0,0.06)'}}
              style={styles.item}
              disabled={it.disabled}
              onPress={() => {
                close();
                setTimeout(() => it.onPress?.(), 0);
              }}>
              <Text
                style={[
                  styles.itemText,
                  it.danger && {color: '#dc2626'},
                  it.disabled && {opacity: 0.5},
                ]}>
                {it.label}
              </Text>
              {idx < items.length - 1 && <View style={styles.divider} />}
            </Pressable>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Nút "Chọn tác vụ"
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1.5,
    borderColor: '#22c55e',
    borderRadius: 10,
    backgroundColor: 'rgba(34,197,94,0.08)',
  },
  triggerText: {
    marginLeft: 6,
    fontWeight: '700',
    color: '#16a34a',
  },

  // Hộp menu
  menu: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 6,

    // shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 6},
    // shadow Android
    elevation: 6,
  },

  // Mũi tên (hình vuông xoay 45°)
  arrowWrap: {position: 'absolute', top: -6, left: 16},
  arrow: {
    width: 12,
    height: 12,
    backgroundColor: '#fff',
    transform: [{rotate: '45deg'}],
    borderTopLeftRadius: 2,
  },

  item: {paddingVertical: 10, paddingHorizontal: 14},
  itemText: {color: '#335DFF', fontWeight: '600'},
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e7eb',
    marginTop: 10,
  },
});
