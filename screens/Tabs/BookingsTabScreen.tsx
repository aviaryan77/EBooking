import React from 'react';
import {FlatList, Image} from 'react-native';

import moment from 'moment';

import {currencyFormat} from '../../helpers/eventHelper';
import {Box, Flex, Screen, Text, W} from '../../theme';
import {useAppSelector} from '../../store/ReduxHook';
import Log from '../../services/Log';

const BookingsTabScreen = ({route, navigation}: any) => {
  const {bookings} = useAppSelector(state => state.bookings);

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
          <Box px={16} flex={1} height="auto" justifyContent="space-between">
            <Box>
              <Box
                px={8}
                mb={8}
                bg="#abab00"
                borderRadius={4}
                alignSelf="flex-start"
                alignItems="flex-start">
                <Text
                  variant="regular"
                  color="#ffffff"
                  lineHeight={20}
                  textTransform="capitalize">
                  Payment Status: Pending
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
      </Box>
    );
  };

  const renderEmptyComponent = () => (
    <Box alignItems="center" mt={32}>
      <Text fontSize={14} lineHeight={16} variant="medium" color="#004AAD">
        No bookings found
      </Text>
    </Box>
  );

  //_________________main return________________//
  return (
    <Screen flex={1} width={W}>
      <Box flex={1}>
        <Box width={'100%'} top={0} mt={32} px={32} mb={32}>
          <Flex justify="space-between">
            <Text fontSize={24} variant="semiBold">
              My Bookings({bookings?.length ?? 0})
            </Text>
          </Flex>
        </Box>

        <FlatList
          data={bookings}
          renderItem={renderEventCard}
          keyExtractor={item => item?.booking_id as string}
          ListEmptyComponent={renderEmptyComponent}
          contentContainerStyle={{paddingBottom: 400}}
        />
      </Box>
    </Screen>
  );
};

export default BookingsTabScreen;
