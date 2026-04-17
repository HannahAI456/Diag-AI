// SwipeableRow.js
import React, {useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
// import {Swipeable, RectButton} from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function SwipeableRow({
  item,
  onPin,
  onRead,
  onDelete,
  children,
  contentStyle,
  inheritChildStyle = true,
}) {
  const ref = useRef(null);
  const close = () => ref.current?.close();

  const Action = ({color, icon, label, onPress}) => (
    <>
      {/* <RectButton
        style={[s.actionBtn, {backgroundColor: color}]}
        onPress={() => {
          close();
          onPress?.(item);
        }}> */}
        <Ionicons name={icon} size={20} color="#fff" />
        <Text style={s.actionText}>{label}</Text>
      {/* </RectButton> */}
    </>
  );

  const renderRightActions = () => (
    <View style={s.actions}>
      {/* <Action color="#f59e0b" icon="pin-outline" label="Ghim" onPress={onPin} /> */}
      <Action
        color="#22c55e"
        icon="checkmark-done-outline"
        label="Đã đọc"
        onPress={onRead}
      />
      <Action
        color="#ef4444"
        icon="trash-outline"
        label="Xóa"
        onPress={onDelete}
      />
    </View>
  );

  // ---- auto đồng bộ style với child ----
  let content = children;
  if (inheritChildStyle && React.isValidElement(children)) {
    const childStyle = children.props?.style;
    content = React.cloneElement(children, {
      style: [s.card, contentStyle, childStyle],
    });
  } else {
    content = <View style={[s.card, contentStyle]}>{children}</View>;
  }

  return (
    <>
      {/* <Swipeable
        ref={ref}
        renderRightActions={renderRightActions}
        overshootRight
        rightThreshold={40}
        friction={2}> */}
      {content}
      {/* </Swipeable> */}
    </>
  );
}

const s = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    alignSelf: 'stretch',
  },
  actionBtn: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e5e7eb',
  },
});
