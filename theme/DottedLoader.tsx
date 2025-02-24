import React, {FC, useEffect, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';
import { COLORS, Text } from '../theme';

interface DottedLoaderProps {
  color?: string;
}
const DottedLoader:FC<DottedLoaderProps> = ({
  color=COLORS.white

}) => {
  const dotOpacity1 = useRef(new Animated.Value(0)).current;
  const dotOpacity2 = useRef(new Animated.Value(0)).current;
  const dotOpacity3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateDots = () => {
      const duration = 500;

      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(dotOpacity1, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
            }),
            Animated.timing(dotOpacity1, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dotOpacity2, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
              delay: duration / 2, // Delay the start of the animation for the second dot
            }),
            Animated.timing(dotOpacity2, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(dotOpacity3, {
              toValue: 1,
              duration: duration,
              useNativeDriver: true,
              delay: duration, // Delay the start of the animation for the third dot
            }),
            Animated.timing(dotOpacity3, {
              toValue: 0,
              duration: duration,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ).start();
    };

    animateDots();
  }, [dotOpacity1, dotOpacity2, dotOpacity3]);

  return (
    <View style={styles.container}>
      <Text variant="medium16" />
      <Animated.View style={[styles.dot, {opacity: dotOpacity1, backgroundColor: color }]} />
      <Animated.View
        style={[styles.dot, {opacity: dotOpacity2, marginLeft: 8, backgroundColor: color}]}
      />
      <Animated.View
        style={[styles.dot, {opacity: dotOpacity3, marginLeft: 8, backgroundColor: color}]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default DottedLoader;
