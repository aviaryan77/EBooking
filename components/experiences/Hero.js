import React, {useRef} from 'react';
import {Animated} from 'react-native';

import Down from '../../svg/new/down2';
import {Center} from '../../components/Restyle';
import {Box, Text, W} from '../../Constants/Theme';
import Svg, {Stop, Defs, Rect, LinearGradient} from 'react-native-svg';

const Hero = ({event, bannerHeight}) => {
  const IMAGE_WIDTH = W * 0.92;
  const flatListRef = useRef();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollA = useRef(new Animated.Value(0)).current;

  const OverLay = () => {
    return (
      <Svg height="100%" width="100%" position="absolute">
        <Defs>
          <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#fff" stopOpacity="0" />
            <Stop offset="1" stopColor="#000" stopOpacity=".4" />
          </LinearGradient>
        </Defs>

        <Rect
          y="0"
          x="0"
          rx={10}
          ry={10}
          width="100%"
          height="100%"
          strokeWidth="4"
          fill={'url(#grad)'}
          strokeLinecap="round"
        />
      </Svg>
    );
  };

  return (
    <Center>
      <Animated.FlatList
        horizontal
        pagingEnabled
        ref={flatListRef}
        scrollEventThrottle={16}
        decelerationRate={0.95}
        data={event?.gallery ?? []}
        keyExtractor={(item, index) => index}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingRight: event?.gallery?.length === 1 ? 10 : 50,
        }}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: true},
        )}
        renderItem={({item, index}) => {
          const inputRange = [(index - 1) * W, index * W, (index + 1) * W];
          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-W * 0.7, 0, W * 0.7],
          });
          return (
            <Animated.View
              width={W}
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                transform: [
                  {
                    translateY: scrollA.interpolate({
                      inputRange: [
                        -bannerHeight,
                        0,
                        bannerHeight,
                        bannerHeight + 1,
                      ],
                      outputRange: [
                        -bannerHeight / 2,
                        0,
                        bannerHeight * 0.75,
                        bannerHeight * 0.75,
                      ],
                    }),
                  },
                ],
              }}>
              <Box
                my="m"
                ml="m"
                width="auto"
                flexDirection="row"
                alignItems="center">
                <Box
                  style={{
                    height: IMAGE_WIDTH * 0.66,
                    width: IMAGE_WIDTH,
                    borderRadius: 14,
                    overflow: 'hidden',
                    alignItems: 'center',
                  }}>
                  <Animated.Image
                    source={{uri: item?.url}}
                    style={{
                      width: IMAGE_WIDTH,
                      height: IMAGE_WIDTH * 0.66,
                      borderRadius: 10,
                      resizeMode: 'contain',
                      transform: [{translateX}],
                    }}
                  />

                  <OverLay />
                  {event?.gallery?.length > 1 && (
                    <Animated.View
                      style={{
                        top: 12,
                        left: 12,
                        borderRadius: 12,
                        paddingVertical: 4,
                        paddingHorizontal: 8,
                        position: 'absolute',
                        backgroundColor: 'rgba(0, 0, 0, 0.65)',
                        transform: [{translateX}],
                      }}>
                      <Text
                        variant="regular"
                        fontSize={12}
                        lineHeight={14}
                        color="primaryWhite">{`${index + 1}/${
                        event?.gallery?.length
                      }`}</Text>
                    </Animated.View>
                  )}
                </Box>
              </Box>
            </Animated.View>
          );
        }}
      />
      <Box position="absolute" bottom={30} width={W * 0.8}>
        <Text
          fontSize={20}
          lineHeight={24}
          textAlign="left"
          variant="semiBold"
          color="primaryWhite"
          style={{
            textShadowColor: 'black',
            textShadowOffset: {width: 1, height: 2},
            textShadowRadius: 10,
          }}>
          {event?.name}
        </Text>
      </Box>
    </Center>
  );
};

export default Hero;
