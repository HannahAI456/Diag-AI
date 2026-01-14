import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {MAX_H, MAX_W} from '../../Common/GlobalStyles';

const DemoScreen = () => {
  const moods = ['Sad', 'Happy', 'Angry'];
  const [selectedMood, setSelectedMood] = useState('Happy');

  const renderMoodPill = mood => {
    const isSelected = selectedMood === mood;
    return (
      <TouchableOpacity
        key={mood}
        activeOpacity={0.8}
        onPress={() => setSelectedMood(mood)}
        style={[
          styles.moodPill,
          isSelected ? styles.moodPillSelected : styles.moodPillUnselected,
        ]}>
        <Text
          style={[
            styles.moodText,
            isSelected ? styles.moodTextSelected : styles.moodTextUnselected,
          ]}>
          {mood}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: 'https://i.ibb.co/7x8q4y75/Screenshot-2026-01-01-at-00-02-59.png',
          }}
          style={styles.headerImage}
        />
      </View>
      <View style={styles.body}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodRow}>
          {moods.map(renderMoodPill)}
        </ScrollView>

        <View style={styles.questionWrap}>
          <Text style={styles.questionText}>How do you{`\n`}feel today?</Text>
        </View>

        <View style={styles.bottom}>
          <TouchableOpacity activeOpacity={0.8}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.85} style={styles.nextButton}>
            <Text style={styles.nextText}>Next</Text>
            <Text style={styles.nextArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DemoScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#1c1c1c', paddingBottom: 60},
  header: {
    height: MAX_H * 0.5,
    backgroundColor: '#fee7f5',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerImage: {
    width: '72%',
    height: '72%',
    resizeMode: 'cover',
  },
  body: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 18,
  },
  moodRow: {
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: -22,
    alignItems: 'center',
  },
  moodPill: {
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 12,
    marginHorizontal: 8,
    minWidth: MAX_W * 0.26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodPillSelected: {
    backgroundColor: '#fdb1e4',
  },
  moodPillUnselected: {
    backgroundColor: '#646363ff',
  },
  moodText: {
    fontSize: 16,
    fontWeight: '600',
  },
  moodTextSelected: {
    color: '#1c1c1c',
  },
  moodTextUnselected: {
    color: '#fff',
  },
  questionWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  questionText: {
    color: '#fff',
    fontSize: 40,
    lineHeight: 46,
    fontWeight: '800',
    textAlign: 'center',
  },
  bottom: {
    height: MAX_H * 0.12,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 26,
  },
  skipText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#fff',
    borderRadius: 999,
    paddingHorizontal: 26,
    paddingVertical: 14,
    minWidth: MAX_W * 0.42,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  nextText: {
    color: '#1c1c1c',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  nextArrow: {
    color: '#1c1c1c',
    fontSize: 22,
    fontWeight: '900',
    marginTop: -1,
  },
});
