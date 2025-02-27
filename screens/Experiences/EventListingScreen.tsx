import React, {useState, useEffect, useRef} from 'react';
import {FlatList, Pressable, Image} from 'react-native';

import moment from 'moment';

import LocationSelector from '../../components/experiences/locationSelector';
import {currencyFormat} from '../../helpers/eventHelper';
import {Box, Flex, Screen, Text, W} from '../../theme';
import {CloseIcon} from '../../svg/Icons';
import {EVENT_DATA} from '../../components/experiences/EVENT_DATA';

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

  const [city, setCity] = useState<string>('');
  const locationSelectorRef = useRef<any>(null);

  const openLocationModal = () => {
    locationSelectorRef.current.openModal();
  };

  useEffect(() => {
    if (city == '' && selectedCategory == 'all') {
      openLocationModal();
    }
  }, [city]);

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredExperienceList, setFilteredExperienceList] =
    useState(experienceList);

  const userId = 'asdfggd';

  const onCategoryPress = (item: any) => {
    setCity('');
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

  const onLocationSelect = (city: string) => {
    setCity(city);
    if (city === 'all') {
      setFilteredExperienceList(experienceList);
    } else {
      setFilteredExperienceList(
        experienceList.filter(
          event => event?.location?.city?.toLowerCase() == city.toLowerCase(),
        ),
      );
    }
  };

  const event_home_message_1 = 'Live Concert : Where Energy Meet Excitement';
  const event_home_message_2 =
    'with electrifying performances and atmosphere that will leave you spellbound';

  const renderCategory = ({item, index}: any) => {
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
          borderColor="#004AAD"
          bg={selected ? '#004AAD' : '#ffffff'}>
          <Text
            fontSize={14}
            lineHeight={16}
            textTransform="capitalize"
            variant={selected ? 'semiBold' : 'medium'}
            color={selected ? '#ffffff' : '#004AAD'}>
            {item}
          </Text>
        </Box>
      </Pressable>
    );
  };

  const renderEventCard = ({item, index}: any) => {
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
                    source={item?.thumbnail}
                    style={{
                      width: 120,
                      height: 200,
                      resizeMode: 'stretch',
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
                    bg="#AA00AA"
                    borderRadius={4}
                    alignSelf="flex-start"
                    alignItems="flex-start">
                    <Text
                      variant="regular"
                      color="#ffffff"
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
                  <Text
                    variant="medium"
                    fontSize={12}
                    lineHeight={14}
                    color="primaryRed"
                    mt={16}>
                    Only {item?.inventory} tickets remaining
                  </Text>
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
        <Box marginTop={16}></Box>
      </>
    );
  };

  const renderEmptyComponent = () => (
    <Box alignItems="center" mt={32}>
      <Text fontSize={14} lineHeight={16} variant="medium" color="#004AAD">
        More events coming soon!
      </Text>
    </Box>
  );

  //_________________main return________________//
  return (
    <Screen flex={1} width={W} bg="#004AAD">
      <Box flex={1}>
        <Box width={'100%'} top={0} mt={32} px={32} mb={32}>
          <Flex justify="space-between">
            <CloseIcon
              width={30}
              height={30}
              onPress={() => navigation.goBack()}
            />
            <Box>
              <LocationSelector
                ref={locationSelectorRef}
                setCity={onLocationSelect}
                city={city}
              />
            </Box>
          </Flex>

          <Text
            fontSize={20}
            lineHeight={24}
            variant="semiBold"
            paddingVertical={8}
            color={'#ffffff'}>
            {event_home_message_1}
          </Text>
          <Text
            opacity={0.75}
            variant="regular"
            letterSpacing={-0.3}
            color={'#ffffff'}
            style={{maxWidth: '90%'}}>
            {event_home_message_2}
          </Text>
        </Box>

        <Box width={W} borderRadius={24} bg="#ffffff" minHeight={700}>
          <FlatList
            horizontal
            data={category}
            keyExtractor={item => item}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingLeft: 16}}
          />

          <FlatList
            data={filteredExperienceList}
            renderItem={renderEventCard}
            keyExtractor={item => item?._id}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{paddingBottom: 400}}
          />
        </Box>
      </Box>
    </Screen>
  );
};

export default EventListingScreen;
