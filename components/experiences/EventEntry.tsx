import React, {useState, useRef} from 'react';
import {Pressable, Animated, Image} from 'react-native';

import moment from 'moment';
import {EVENT_DATA} from './EVENT_DATA';
import {Box, Text, W} from '../../theme';
import {currencyFormat} from '../../helpers/eventHelper';
import {navigate} from '../../navigation/RootNavigation';
import Svg, {Stop, Defs, Rect, Line, LinearGradient} from 'react-native-svg';

const EventEntry = ({visible}: any) => {
  if (!visible) return null;

  const [experienceList, setExperienceList] = useState(EVENT_DATA);
  const [selectedCity, setSelectedCity] = useState('');

  const updateExperienceListing = (
    eventId: string,
    views: number,
    like: number,
    comments: number,
    likesByUser: number,
  ) => {
    setExperienceList(prevList => {
      // Create a copy of the previous experience list
      const updatedList = [...prevList];

      // Find the index of the experience with the matching eventId
      const experienceIndex = updatedList.findIndex(
        experience => experience.id === eventId,
      );

      // If the experience is found in the list
      if (experienceIndex !== -1) {
        // Create a copy of the stats object
        const updatedStats = {...updatedList[experienceIndex].stats};

        // Update the stats object with the provided views, like, and comments if they are provided
        if (views !== null) {
          updatedStats.views = views;
        }

        if (like !== null) {
          updatedStats.like = like;
        } else {
          updatedStats.like = 0;
        }

        // Update the stats object in the experience list
        updatedList[experienceIndex].stats = updatedStats;
      }

      // Return the updated experience list
      return updatedList;
    });
  };

  const scrollX = useRef(new Animated.Value(0)).current;
  const event_home_message_1 = 'Live Concert : Where Energy Meet Excitement';
  const event_home_message_2 =
    'with electrifying performances and atmosphere that will leave you spellbound';

  const renderExperienceCard = ({item, index}: any) => {
    const isOneDayEvent =
      moment(item.end_date)?.utcOffset('+05:30')?.format('DD MMM').toString() ==
      moment(item.start_date)?.utcOffset('+05:30')?.format('DD MMM').toString();

    return (
      <Pressable
        onPress={() => {
          navigate('EventDetailsScreen', {
            event: item,
            updateExperienceListing,
          });
        }}>
        <Box ml={16} width={W * 0.82} flexDirection="row">
          <Svg
            //@ts-ignore
            top={-3}
            height={210}
            width="100%"
            strokeWidth="3"
            position="absolute">
            <Defs>
              <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor="#5563DA" stopOpacity="1" />
                <Stop offset="1" stopColor="#FFF" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Rect
              x="4"
              y="4"
              rx={10}
              ry={10}
              width="96%"
              height={203}
              strokeWidth="4"
              fill={'#ffffff'}
              stroke={'url(#grad)'}
              strokeLinecap="round"
            />
          </Svg>
          <Box px={16} width="60%">
            <Text
              mt={16}
              variant="bold"
              fontSize={16}
              lineHeight={20}
              numberOfLines={2}
              allowFontScaling={false}>
              {item.name}
            </Text>
            <Text
              mt={8}
              fontSize={12}
              lineHeight={16}
              variant="regular"
              allowFontScaling={false}
              numberOfLines={2}>
              {item?.location?.address ?? ''}
            </Text>
            <Text
              fontSize={12}
              color="grey200"
              lineHeight={16}
              variant="regular"
              allowFontScaling={false}>
              {`${moment(item.start_date)
                ?.utcOffset('+05:30')
                ?.format('DD MMM')} ${
                item?.end_date && !isOneDayEvent
                  ? moment(item.end_date)
                      ?.utcOffset('+05:30')
                      ?.format('- DD MMM')
                  : ''
              }`}
            </Text>
            <Box mt={8} width={20} height={2} bg="lightBlue" borderRadius={4} />
            <Text
              mt={8}
              variant="medium"
              lineHeight={20}
              fontSize={16}
              allowFontScaling={false}>
              ₹{currencyFormat(item.price)}{' '}
              <Text
                mt={16}
                lineHeight={20}
                variant="regular"
                allowFontScaling={false}>
                onwards
              </Text>
            </Text>

            <Svg height="10" width="100%">
              <Defs>
                <Defs>
                  <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor="#38A794" stopOpacity=".8" />
                    <Stop offset="1" stopColor="#ffffff" stopOpacity="1" />
                  </LinearGradient>
                </Defs>
              </Defs>

              <Line
                x1="0"
                y1="10"
                x2="150"
                y2="10"
                stroke={'url(#grad)'}
                strokeWidth="1"
              />
            </Svg>
            <Text
              mt={8}
              variant="semiBold"
              fontSize={12}
              lineHeight={14}
              color="green500"
              allowFontScaling={false}>
              {item?.flash_sale_text}
            </Text>
          </Box>
          <Box width="40%">
            <Box
              overflow="hidden"
              style={{
                width: 120,
                height: 200,
                overflow: 'hidden',
                alignItems: 'center',
                marginVertical: 3,

                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
              }}>
              <Image
                source={{
                  uri: !!item?.gallery[0]?.thumbnail
                    ? item?.gallery[0]?.thumbnail
                    : !!item?.gallery[0]?.url
                    ? item?.gallery[0]?.url
                    : 'https://firebasestorage.googleapis.com/v0/b/splitkaro-web.appspot.com/o/SplitkaroLogo.png?alt=media&token=ef424815-59c1-45bf-936a-33e4ee1045ec',
                }}
                style={{
                  width: 120,
                  height: 200,
                  resizeMode: 'stretch',
                }}
              />
            </Box>
          </Box>
        </Box>
      </Pressable>
    );
  };

  const Indicator = ({scrollX}: any) => {
    return (
      <Box flexDirection="row" mr={16} my={16} justifyContent="flex-end">
        {experienceList?.slice(0, 4)?.map((_, i) => {
          const inputRange = [(i - 1) * W, i * W, (i + 1) * W];
          const scaleX = scrollX.interpolate({
            inputRange,
            outputRange: [1, 3, 1],
            extrapolate: 'clamp',
          });
          const color = scrollX.interpolate({
            inputRange,
            outputRange: [
              'rgba(85, 99, 218, .2)',
              'rgb(85, 99, 218)',
              'rgba(85, 99, 218, .3)',
            ],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={`indicator-${i}`}
              style={{
                height: 4,
                width: 10,
                borderRadius: 1.5,
                marginVertical: 4,
                marginHorizontal: 10,
                backgroundColor: color,
                transform: [{scaleX: scaleX}],
              }}
            />
          );
        })}
      </Box>
    );
  };

  const UpwardShadow = () => (
    <Box
      top={0}
      overflow="hidden"
      alignSelf="center"
      position="absolute"
      style={{
        height: 50,
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../assets/experiences/shadow_downward.png')}
        style={{
          width: W * 0.8,
          height: W * 0.1,
          resizeMode: 'cover',
        }}
      />
    </Box>
  );
  const DownwardShadow = () => (
    <Box
      bottom={0}
      overflow="hidden"
      alignSelf="center"
      position="absolute"
      style={{
        height: 50,
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../assets/experiences/shadow_upward.png')}
        style={{
          width: W * 0.8,
          height: W * 0.1,
          resizeMode: 'cover',
        }}
      />
    </Box>
  );
  if (!experienceList?.length) return null;

  //___________main return____________//
  return (
    <Box my={16} py={8}>
      <UpwardShadow />
      <DownwardShadow />

      <Box
        py={16}
        px={16}
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between">
        <Box flex={1} mr={16}>
          <Text variant="semiBold" fontSize={18} lineHeight={24}>
            {event_home_message_1}
          </Text>
          <Text variant="regular" color="grey200" fontSize={12}>
            {event_home_message_2}
          </Text>
        </Box>
        <Box>
          <Text
            onPress={() => {
              navigate('EventListingScreen', {
                experienceList,
                updateExperienceListing,
                city: selectedCity,
              });
            }}
            variant="semiBold"
            color="primaryBlack"
            textDecorationLine="underline">
            See all
          </Text>
        </Box>
      </Box>
      <Animated.FlatList
        horizontal
        data={experienceList?.slice(0, 4)}
        keyExtractor={item => item._id}
        renderItem={renderExperienceCard}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingRight: 100}}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: scrollX}}}],
          {useNativeDriver: false},
        )}
      />

      <Box flex={0.08}>
        <Indicator scrollX={scrollX} />
      </Box>
    </Box>
  );
};

export default EventEntry;
