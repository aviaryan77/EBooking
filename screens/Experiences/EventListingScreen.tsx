import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, FlatList, RefreshControl, Pressable} from 'react-native';
import Image from 'react-native-scalable-image';

import moment from 'moment';

import LocationSelector from '../../components/experiences/locationSelector';
import {currencyFormat} from '../../helpers/eventHelper';
import {Box, Flex, Screen, Text, W} from '../../theme';
import {CloseIcon} from '../../svg/Icons';
import { EVENT_DATA } from '../../components/experiences/EVENT_DATA';
// import { userCurrency } from '../../helperFunctions/currencies';

const category = [
  'all',
  'events',
  'music',
  'LifeStyle',
  'Active',
  'Sports',
  'Expo',
];

const EventListingScreen = ({route, navigation}: any) => {
  const [experienceList, setExperienceList] = useState(EVENT_DATA);

  useEffect(() => {
    if (route?.params?.experienceList) {
    } else {
    }
  }, []);
  const [city, setCity] = useState(
    route?.params?.city ? route?.params?.city : '',
  );
  const locationSelectorRef = useRef<any>(null);

  const openLocationModal = () => {
    locationSelectorRef.current.openModal();
  };

  useEffect(() => {
    if (city == '') {
      openLocationModal();
    }
  }, [city]);


  const updateExperienceListing = (
    eventId: any,
    views: any,
    like: any,
    comments: any,
    likesByUser: any,
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

        if (likesByUser !== null) {
          updatedStats.likesByUser = likesByUser;
        }

        if (comments !== null) {
          updatedStats.comments = comments;
        }

        // Update the stats object in the experience list
        updatedList[experienceIndex].stats = updatedStats;
      }

      // Return the updated experience list
      return updatedList;
    });
  };

  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredExperienceList, setFilteredExperienceList] =
    useState(experienceList);

  const userId = 'asdfggd';

  const onCategoryPress = (item:any )=> {
    if (item === 'all') {
      setFilteredExperienceList(experienceList);
    } else {
      setFilteredExperienceList(
        experienceList.filter(
          event => event?.type?.toLowerCase() == item.toLowerCase(),
        ),
      );
    }
    setSelectedCategory(item?.toLowerCase());
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if (city != '') {
    }

    // wait(1000).then(() => setRefreshing(false));
  }, [city]);

  useEffect(() => {
    if (city != '') {
      setRefreshing(true);

    }
  }, [city]);



  const openCommentInside = (item:any) => {
    navigation.navigate('EventDetailsScreen', {
      event: item,
      updateExperienceListing: route?.params?.updateExperienceListing,
      openComment: true,
    });
  };

  const event_home_message_1 = 'Live Concert : Where Energy Meet Excitement';
  const event_home_message_2 =
    'with electrifying performances and atmosphere that will leave you spellbound';


  const renderCategory = ({item, index}:any) => {
    let selected = selectedCategory?.toLowerCase() === item?.toLowerCase();
    return (
      <Pressable onPress={() => onCategoryPress(item)}>
        <Box
          px={16}
          py={8}
          mr={8}
          my={16}
          height={36}
          borderWidth={1}
          borderRadius={16}
          alignItems="center"
          justifyContent="center"
          borderColor="primaryBlue"
          bg={selected ? 'primaryBlue' : 'primaryWhite'}>
          <Text
            fontSize={14}
            lineHeight={16}
            textTransform="capitalize"
            variant={selected ? 'semiBold' : 'medium'}
            color={selected ? 'primaryWhite' : 'primaryBlue'}>
            {item}
          </Text>
        </Box>
      </Pressable>
    );
  };

  const renderEventCard = ({item, index}:any) => {
    let event = item;
    const isOneDayEvent =
      moment(event?.end_date)
        ?.utcOffset('+05:30')
        ?.format('DD MMM')
        .toString() ==
      moment(event?.start_date)
        ?.utcOffset('+05:30')
        ?.format('DD MMM')
        .toString();
    return (
      <>
        <Pressable
          onPress={() => {
            navigation.navigate('EventDetailsScreen', {
              event: item,
              updateExperienceListing: route?.params?.updateExperienceListing,
            });
          }}>
          <Box py={8} px={16} mt={16}>
            <Box py={16} flexDirection="row" justifyContent="center">
              <Box width={120} justifyContent="center">
                <Box borderRadius={12} overflow="hidden">
                  <Image
                    width={120}
                    source={{
                      uri: !!event?.gallery[0]?.thumbnail
                        ? event?.gallery[0]?.thumbnail
                        : !!event?.gallery[0]?.url
                        ? event?.gallery[0]?.url
                        : 'https://firebasestorage.googleapis.com/v0/b/splitkaro-web.appspot.com/o/SplitkaroLogo.png?alt=media&token=ef424815-59c1-45bf-936a-33e4ee1045ec',
                    }}
                  />
                </Box>
              </Box>
              <Box
                px={16}
                flex={1}
                height="auto"
                justifyContent="space-between">
                <Box>
                  <Box
                    px={8}
                    mb={8}
                    bg="yellow"
                    borderRadius={4}
                    alignSelf="flex-start"
                    alignItems="flex-start">
                    <Text
                      variant="regular"
                      color="primaryWhite"
                      lineHeight={20}
                      textTransform="capitalize">
                      {event?.type}
                    </Text>
                  </Box>

                  <Text variant="semiBold" fontSize={16} lineHeight={20}>
                    {event?.name}
                  </Text>
                  <Text
                    variant="regular"
                    color="grey200"
                    fontSize={14}
                    lineHeight={20}>
                    {event?.location?.address ?? event?.location?.city}
                  </Text>
                  <Box style={{flexDirection: 'row'}}>
                    <Text
                      fontSize={12}
                      color="grey200"
                      lineHeight={16}
                      variant="regular"
                      allowFontScaling={false}>
                      {`${moment(event?.start_date)
                        ?.utcOffset('+05:30')
                        ?.format('DD MMM')} ${
                        event?.end_date && !isOneDayEvent
                          ? moment(event?.end_date)
                              ?.utcOffset('+05:30')
                              ?.format('- DD MMM')
                          : ''
                      }`}
                    </Text>
                    <Text> &#10022; {event?.duration}</Text>
                  </Box>
                </Box>

                <Box>
                  {/* <Text
                variant="medium"
                fontSize={12}
                lineHeight={14}
                color="primaryRed"
                mt={16}>
                Only {item?.inventory} tickets remaining
              </Text> */}
                  <Text mt={8} fontSize={16} variant="semiBold">
                    ₹{currencyFormat(item?.price)}{' '}
                    <Text fontSize={14} variant="regular">
                      per person
                    </Text>
                  </Text>
                </Box>
              </Box>
            </Box>
            {item?.flash_sale_text.length > 0 && (
              <Box
                px={16}
                py={8}
                width="100%"
                bg="green100"
                borderRadius={8}
                justifyContent="center">
                <Text variant="medium" fontSize={12} color="green500">
                  {item?.flash_sale_text}
                </Text>
              </Box>
            )}
          </Box>
        </Pressable>
        <Box marginTop={16}>

         
        </Box>
      </>
    );
  };

  const renderEmptyComponent = () => (
    <Box alignItems="center" mt="l">
      <Text fontSize={14} lineHeight={16} variant="medium" color="primaryBlue">
        More events coming soon!
      </Text>
    </Box>
  );

  //_________________main return________________//
  return (
    <Screen flex={1} width={W} bg="primaryBlue">
      <Box flex={1}>
        <Box width={'100%'} top={0} mt="l" px="l" mb="l">
          <Flex justify="space-between">
            <CloseIcon
              width={30}
              height={30}
              onPress={() => navigation.goBack()}
            />
            <Box>
              <LocationSelector ref={locationSelectorRef} setCity={setCity} />
            </Box>
          </Flex>

          <Text
            fontSize={20}
            lineHeight={24}
            variant="semiBold"
            paddingVertical={8}
            color={'primaryWhite'}>
            {event_home_message_1}
          </Text>
          <Text
            opacity={0.75}
            variant="regular"
            letterSpacing={-0.3}
            color={'primaryWhite'}
            style={{maxWidth: '90%'}}>
            {event_home_message_2}
          </Text>
        </Box>

        <Box width={W} borderRadius={24} bg="primaryWhite" minHeight={700}>
          {/* <FlatList
            horizontal
            data={category}
            keyExtractor={item => item}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingLeft: 16}}
          /> */}

          <FlatList
            data={filteredExperienceList}
            renderItem={renderEventCard}
            keyExtractor={item => item?._id}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{paddingBottom: 400}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </Box>
      </Box>
    </Screen>
  );
};

export default EventListingScreen;
