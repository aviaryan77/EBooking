import React, {useState, useEffect, useRef} from 'react';
import { Pressable } from 'react-native'
import moment from 'moment';
import {Box, Text, W} from '../../Constants/Theme';
import {Animated, Image, View} from 'react-native';
import {getAllExperiences} from '../../helperFunctions/Api';
import {currencyFormat} from '../../helperFunctions/eventHelper';

import Svg, {Stop, Defs, Rect, Line, LinearGradient} from 'react-native-svg';

import {analytics} from '../../configs/analytics';
import Log from '../../helperFunctions/Log';
import getRemoteValues from '../../functions/getRemoteValues';
import { userCurrency } from '../../helperFunctions/currencies';
import { AuthContext } from '../../contexts/authContext';

const ExperiencesEntry = ({visible, refreshing, navigation}) => {
return null;
  if (!visible) return null;
  const [experienceList, setExperienceList] = useState([]);
  const { state } = React.useContext(AuthContext);
  const userData = JSON.parse(state.userData);

  useEffect(() => {
    getExperiences();
  }, []);

  useEffect(() => {
    !!refreshing && getExperiences();
  }, [refreshing]);

  const getExperiences = async () => {
    let res = await getAllExperiences();

    if (res.status == 200) {
      setExperienceList(res?.data?.reverse() ?? []);
      analytics.track('Events Loaded');
    }
  };

  const scrollX = useRef(new Animated.Value(0)).current;
  const event_home_message_1 = getRemoteValues(
    'event_home_message_1',
  ).asString();
  const event_home_message_2 = getRemoteValues(
    'event_home_message_2',
  ).asString();

  const renderExperienceCard = ({item, index}) => {
    const isOneDayEvent =
      moment(item.end_date)?.utcOffset('+05:30')?.format('DD MMM').toString() ==
      moment(item.start_date)?.utcOffset('+05:30')?.format('DD MMM').toString();

    return (
      <Pressable onPress={() => {
        navigation.navigate('EventDetailsScreen', {event: item});
        analytics.track('Home Event Click', {name: item.name});
      }}>
        <Box
          ml="m"
          width={W * 0.82}
          flexDirection="row"
          >
          <Svg
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
          <Box px="m" width="60%">
            <Text
              mt="m"
              variant="bold"
              fontSize={16}
              lineHeight={20}
              numberOfLines={2}
              allowFontScaling={false}>
              {item.name}
            </Text>
            <Text
              mt="s"
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
            <Box mt="s" width={20} height={2} bg="lightBlue" borderRadius={4} />
            <Text
              mt="s"
              variant="medium"
              lineHeight={20}
              fontSize={16}
              allowFontScaling={false}>
              {userCurrency(userData)}{currencyFormat(item.price)}{' '}
              <Text
                mt="m"
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
              mt="s"
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
                overflow: 'hidden',
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

  const Indicator = ({scrollX}) => {
    return (
      <Box flexDirection="row" mr="m" my="m" justifyContent="flex-end">
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
    <Box my="m" py="s">
      <UpwardShadow />
      <DownwardShadow />

      <Box
        py="m"
        px="m"
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between">
        <Box flex={1} mr="m">
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
              navigation.navigate('EventListingScreen', {experienceList});
              analytics.track('Event See All Click');
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

export default ExperiencesEntry;
