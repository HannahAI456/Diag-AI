import {StyleSheet, Text, View, ImageBackground, Animated} from 'react-native';
import React, {useEffect, useRef} from 'react';

import {MAX_H, MAX_W} from '../../Common/GlobalStyles';

const STEP_DURATION = 400;

const Splash = ({setVisible}) => {
  const progress = useRef(new Animated.Value(0)).current;
  const currentAnimRef = useRef(null);
  const animateTo = (ratio, onEnd) => {
    if (currentAnimRef.current) {
      currentAnimRef.current.stop();
    }
    const anim = Animated.timing(progress, {
      toValue: ratio,
      duration: STEP_DURATION,
      useNativeDriver: false,
    });
    currentAnimRef.current = anim;
    anim.start(({finished}) => {
      if (finished && onEnd) onEnd();
    });
  };

  useEffect(() => {
    let cancelled = false;

    progress.setValue(0);

    animateTo(1);

    const timer = setTimeout(() => {
      if (!cancelled) {
        setVisible(true);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      if (currentAnimRef.current) currentAnimRef.current.stop();
      progress.stopAnimation();
    };
  }, []);

  return (
    <ImageBackground
      source={require('../../../asset/Image/ai-medical-documentation-billing-mobile.jpg')}
      style={styles.background}
      resizeMode="cover">
      <View style={styles.overlay}>
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

export default Splash;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    // height: MAX_H * 0.5,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    // alignSelf: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 40,
    textTransform: 'uppercase',
  },
  progressBarContainer: {
    width: MAX_W * 0.6,
    height: 10,
    backgroundColor: 'gray',
    borderRadius: 100,
    overflow: 'hidden',
    marginBottom: 20,
    position: 'absolute',
    bottom: 25,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
  },
  errorContainer: {
    backgroundColor: '#FFE6E6',
    padding: 10,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#FF9999',
    marginVertical: 10,
    marginHorizontal: 15,
  },
  errorText: {
    color: '#CC0000',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
