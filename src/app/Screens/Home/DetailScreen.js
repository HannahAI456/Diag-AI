import React, {useMemo, useRef, useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ImageBackground,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const formatNumber = n =>
  n >= 1e6
    ? (n / 1e6).toFixed(1) + 'M'
    : n >= 1e3
    ? (n / 1e3).toFixed(1) + 'k'
    : String(n);

const Tag = ({label}) => (
  <View style={styles.tag}>
    <Text style={styles.tagText}>#{label}</Text>
  </View>
);

const DetailScreen = ({route, navigation}) => {
  const item = useMemo(
    () =>
      route?.params?.item || {
        id: 1,
        title: 'Body language with Maya Daryen',
        subtitle: '@maya.daryen',
        image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91',
        gradient: ['#D4B5A0', '#F5E6D3'],
        creator: 'Maya Daryen',
        description:
          'Khám phá nghệ thuật ngôn ngữ cơ thể: tự tin hơn, giao tiếp hiệu quả và truyền cảm hứng qua từng cử chỉ.',
        likes: 1280,
        comments: 245,
        followers: 12_300,
        tags: ['bodylanguage', 'confidence', 'mindset', 'socialskills'],
      },
    [route?.params?.item],
  );

  // Animation cho nút like
  const [liked, setLiked] = useState(false);
  const likeScale = useRef(new Animated.Value(1)).current;
  const onLike = () => {
    setLiked(v => !v);
    Animated.sequence([
      Animated.spring(likeScale, {toValue: 1.35, useNativeDriver: true}),
      Animated.spring(likeScale, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      {/* Ảnh nền full + overlay gradient trên cùng */}
      <ImageBackground
        blurRadius={10}
        source={{uri: item.image}}
        style={styles.hero}
        resizeMode="cover">
        <LinearGradient
          colors={['rgba(0,0,0,0.55)', 'rgba(0,0,0,0.15)', 'rgba(0,0,0,0.75)']}
          style={StyleSheet.absoluteFill}
          start={{x: 0, y: 0}}
          end={{x: 0.8, y: 1}}
        />
        {/* Header trong suốt */}
        <SafeAreaView style={styles.safe}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation?.goBack?.()}
              style={styles.headerBtn}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text numberOfLines={1} style={styles.headerTitle}>
              {item.creator}
            </Text>
            <TouchableOpacity style={styles.headerBtn}>
              <Feather name="more-horizontal" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Card nổi kiểu glassmorphism */}
        <View style={styles.floatingWrap}>
          <LinearGradient
            colors={[...item.gradient, '#FFFFFF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.card}>
            {/* Top row: avatar + info + follow */}
            <View style={styles.rowBetween}>
              <View style={styles.avatarWrap}>
                <LinearGradient
                  colors={['#FF7A7A', '#FFCA7A', '#7AD1FF']}
                  style={styles.storyRing}>
                  <Image source={{uri: item.image}} style={styles.avatar} />
                </LinearGradient>
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.creatorName}>{item.creator}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>

              {/* Follow viền gradient */}
              <LinearGradient
                colors={['#FF7A7A', '#FFD37A']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.followOuter}>
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.followInner}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Ảnh chính bo tròn */}
            <Image source={{uri: item.image}} style={styles.mainImage} />

            {/* Thanh action kiểu Instagram */}
            <View style={styles.actionsRow}>
              <Animated.View style={{transform: [{scale: likeScale}]}}>
                <TouchableOpacity onPress={onLike} style={styles.iconBtn}>
                  {liked ? (
                    <Feather name="heart" size={24} color="#e74c3c" style={[styles.icon, {opacity: 1}]} />
                  ) : (
                    <Feather name="heart" size={24} color="#222" style={styles.icon} />
                  )}
                </TouchableOpacity>
              </Animated.View>
              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="message-circle" size={24} color="#222" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="send" size={24} color="#222" style={styles.icon} />
              </TouchableOpacity>
              <View style={{flex: 1}} />
              <TouchableOpacity style={styles.iconBtn}>
                <Feather name="bookmark" size={24} color="#222" style={styles.icon} />
              </TouchableOpacity>
            </View>

            {/* Stats gọn gàng */}
            <View style={styles.statsRow}>
              <Text style={styles.statText}>
                {formatNumber(liked ? item.likes + 1 : item.likes)} likes ·{' '}
                {formatNumber(item.comments)} comments ·{' '}
                {formatNumber(item.followers)} followers
              </Text>
            </View>

            {/* Tiêu đề + mô tả */}
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.description}>{item.description}</Text>

            {/* Tags */}
            {!!item.tags?.length && (
              <View style={styles.tagsRow}>
                {item.tags.map((t, idx) => (
                  <Tag key={idx} label={t} />
                ))}
              </View>
            )}

            {/* Preview bình luận */}
            <View style={styles.commentCard}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
                }}
                style={styles.cmtAvatar}
              />
              <View style={{flex: 1}}>
                <Text style={styles.cmtName}>linh.ng</Text>
                <Text style={styles.cmtText} numberOfLines={2}>
                  Nội dung hay quá, phần đọc vị ánh mắt rất thực chiến. Chờ
                  video tiếp theo!
                </Text>
              </View>
              <Text style={styles.cmtTime}>2h</Text>
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.9}>
              <Text style={styles.ctaText}>Xem thêm nội dung</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ImageBackground>

      {/* Footer bar nhạt (fake) */}
      <SafeAreaView>
        <View style={styles.footer}>
          <Text style={styles.footerDot}>•</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default DetailScreen;

const CARD_RADIUS = 28;

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#000'},
  safe: {paddingHorizontal: 12},
  hero: {width, height},
  header: {
    marginTop: Platform.OS === 'android' ? 36 : 0,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnText: {color: '#fff', fontSize: 24, lineHeight: 24},
  headerTitle: {
    flex: 1,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
  floatingWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    borderRadius: CARD_RADIUS,
    padding: 16,
    paddingBottom: 20,
    // Glassmorphism-ish
    backgroundColor: 'rgba(255,255,255,0.88)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 12},
        shadowOpacity: 0.18,
        shadowRadius: 24,
      },
      android: {elevation: 12},
    }),
  },
  rowBetween: {flexDirection: 'row', alignItems: 'center'},
  avatarWrap: {width: 56, height: 56},
  storyRing: {
    padding: 2,
    borderRadius: 999,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ddd',
  },
  creatorName: {fontSize: 16, fontWeight: '700', color: '#1c1c1e'},
  subtitle: {fontSize: 12, color: '#636366', marginTop: 2},
  followOuter: {borderRadius: 999, padding: 1.5},
  followInner: {
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  followText: {fontWeight: '700', fontSize: 13, color: '#111'},
  mainImage: {
    width: '100%',
    height: width * 0.9,
    borderRadius: 18,
    marginTop: 14,
    marginBottom: 10,
    backgroundColor: '#eaeaea',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  iconBtn: {paddingVertical: 6, paddingHorizontal: 8},
  icon: {fontSize: 24, opacity: 0.95},
  statsRow: {paddingHorizontal: 4, paddingVertical: 4},
  statText: {color: '#2c2c2e', fontSize: 13, opacity: 0.8},
  title: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: '800',
    color: '#111',
  },
  description: {
    marginTop: 6,
    fontSize: 14.5,
    lineHeight: 20,
    color: '#2c2c2e',
    opacity: 0.95,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {fontSize: 12.5, color: '#1d1d1f'},
  commentCard: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 12,
    padding: 10,
  },
  cmtAvatar: {width: 30, height: 30, borderRadius: 15, marginRight: 10},
  cmtName: {fontWeight: '700', color: '#111', marginBottom: 2},
  cmtText: {color: '#2c2c2e'},
  cmtTime: {marginLeft: 8, color: '#6e6e73', fontSize: 12},
  ctaBtn: {
    marginTop: 14,
    backgroundColor: '#111',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  ctaText: {color: '#fff', fontWeight: '800', fontSize: 16},
  footer: {height: 8, alignItems: 'center', justifyContent: 'center'},
  footerDot: {color: 'rgba(255,255,255,0.5)'},
});
