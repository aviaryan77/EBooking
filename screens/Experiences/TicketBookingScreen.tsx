import React, {useState, useEffect, useRef} from 'react';
import {Pressable, ScrollView} from 'react-native';

import {
  Box,
  Text,
  W,
  Header,
  Screen,
  Center,
  ErrorHandlingModal,
  ErrorHandlingModalRef,
} from '../../theme';
import {TicketCounter} from '../../components/experiences';
import Svg, {Stop, Defs, Rect, LinearGradient} from 'react-native-svg';

import * as Animatable from 'react-native-animatable';

import {
  currencyFormat,
  debounce,
  userCurrency,
} from '../../helpers/eventHelper';
import {EventType} from '../../components/experiences/EVENT_DATA';
// import {createOrder, getPriceBreakup} from '../../helperFunctions/Api';

const TicketBookingScreen = ({route, navigation}: any) => {
  const {event, booking_id} = route.params ?? {};

  type MemberType = 'single' | 'male' | 'female' | 'couple';
  const [memberCount, setMemberCount] = useState({
    single: 0,
    male: 0,
    female: 0,
    couple: 0,
  });
  const [maxMemberCount, setMaxMemberCount] = useState(event?.inventory ?? 0);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [offerAppliedId, setOfferAppliedId] = useState('');
  const [isTicketCollapsed, setIsTicketCollapsed] = useState(false);
  const [totalMemberCount, setTotalMemberCount] = useState<number>(0);
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [offerResponse, setOfferResponse] = useState({
    offer_applied_id: '',
    total_amount: 0,
    total_discount: 0,
    total_quantity: 0,
    final_price: 0,
    total_price: 0,
  });

  let basePrice = event?.price;

  const apiErrorRef = useRef<ErrorHandlingModalRef>(null);
  const collapseRef = useRef<any>(null);
  const counterTexRef = useRef<any>(null);

  useEffect(() => {
    setOfferAppliedId('');
    let totalMember = sumValues(memberCount);
    setTotalMemberCount(+totalMember);

    if (totalMember) debounce(() => getPrice(), 1000);
  }, [memberCount]);

  const getPrice = async () => {
    // setIsDataFetching(true);

    try {
      // let res = await getPriceBreakup({
      //   eventId: event?._id,
      //   data: {
      //     quantities: [
      //       ...groupTypes.map(type => {
      //         return {
      //           unit_type: type,
      //            //@ts-ignore
      //           quantity: memberCount[type],
      //         };
      //       }),
      //     ],
      //   },
      // });
      // if (res.status === 200) {
      //   setOfferResponse(res?.data);
      //   setOfferAppliedId(res?.data?.offer_applied_id);
      //   setIsDataFetching(false);
      // } else {
      //   clearCounter();
      //   setIsDataFetching(false);
      //   apiErrorRef?.current?.showModal(res?.data?.detail);
      // }
    } catch (error) {
      clearCounter();
      setIsDataFetching(false);
      apiErrorRef?.current?.showModal(JSON.stringify(error));
    }
  };

  const sumValues = (obj: object) =>
    Object?.values(obj)?.reduce((a, b) => a + b, 0);

  let price_breakup = event?.price_breakup ?? {};
  let groupTypes = Object.keys(price_breakup ?? []); //'single', 'male',  'female', 'couple' from BE

  const onMinusPress = (type: MemberType) => {
    // setIsDataFetching(true);
    if (memberCount[type] > 0 && memberCount[type] <= maxMemberCount) {
      setMemberCount({
        ...memberCount,
        [type]: memberCount[type] - 1,
      });
    }
  };

  const onPlusPress = (type: MemberType) => {
    setIsDataFetching(false);
    if (memberCount[type] >= 0 && memberCount[type] < maxMemberCount) {
      setMemberCount({
        ...memberCount,
        [type]: memberCount[type] + 1,
      });
    }
  };

  const clearCounter = () => {
    setIsTicketCollapsed(false);
    setMemberCount({
      single: 0,
      male: 0,
      female: 0,
      couple: 0,
    });
  };

  const TicketDetails = ({visible}: {visible: boolean}) => {
    if (!visible) return null;
    return (
      <Box>
        {/* @ts-ignore */}
        {groupTypes?.map((type: MemberType) => {
          return (
            <Box
              px={32}
              pt={16}
              pb={20}
              width={W}
              key={type}
              bg="primaryWhite"
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <Box>
                <Text
                  fontSize={14}
                  lineHeight={20}
                  variant="medium"
                  color="#000000"
                  textTransform="capitalize">
                  {type}
                </Text>
                <Text
                  fontSize={12}
                  variant="medium"
                  color="grey200"
                  textTransform="capitalize">
                  {`${userCurrency}${currencyFormat(
                    price_breakup[type]?.unit_price,
                  )}/${type}`}
                </Text>
              </Box>

              <Box
                width="50%"
                flexDirection="row"
                alignItems="center"
                justifyContent="flex-end">
                <Pressable onPress={() => onMinusPress(type)}>
                  <Center
                    mr={16}
                    width={30}
                    height={30}
                    borderWidth={1}
                    borderRadius={16}
                    borderColor={memberCount[type] > 0 ? '#000000' : 'grey300'}>
                    <Text
                      variant="regular"
                      fontSize={16}
                      lineHeight={24}
                      allowFontScaling={false}
                      color={memberCount[type] > 0 ? '#000000' : 'grey300'}>
                      &#x2014;
                    </Text>
                  </Center>
                </Pressable>

                <Animatable.View
                  style={{width: 35, marginRight: -7}}
                  ref={counterTexRef}>
                  <Text variant="regular" mr={16} allowFontScaling={false}>
                    {memberCount[type]}
                  </Text>
                </Animatable.View>
                <Pressable
                  onPress={() => {
                    onPlusPress(type);
                  }}>
                  <Center
                    width={30}
                    height={30}
                    borderWidth={1}
                    borderRadius={16}
                    borderColor={
                      memberCount[type] < maxMemberCount ? '#000000' : 'grey300'
                    }>
                    <Text
                      fontSize={24}
                      lineHeight={28}
                      variant="regular"
                      allowFontScaling={false}
                      color={
                        memberCount[type] < maxMemberCount
                          ? '#000000'
                          : 'grey300'
                      }>
                      +
                    </Text>
                  </Center>
                </Pressable>
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  const BookingCard = ({card}: any) => {
    const maxPrice = basePrice * card.group_size;
    const selectedCard = offerAppliedId == card?.id;
    return (
      <Box mt={16} mx={16} py={16} height={150} borderRadius={8}>
        {selectedCard && (
          <Box
            px={16}
            py={8}
            left={5}
            top={-12}
            zIndex={10}
            bg="primaryBlue"
            borderRadius={8}
            position="absolute">
            <Text
              fontSize={12}
              variant="bold"
              lineHeight={24}
              color="primaryWhite"
              textTransform="uppercase">
              Offer Applied
            </Text>
          </Box>
        )}
        {/* @ts-ignore */}
        <Svg height="160" width="100%" position="absolute" strokeWidth="3">
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#5563DA" stopOpacity="1" />
              <Stop offset="1" stopColor="#5563DA" stopOpacity=".17" />
            </LinearGradient>
          </Defs>

          <Rect
            x="8"
            y="8"
            width="96%"
            height="140"
            strokeWidth="4"
            stroke={selectedCard ? '#5563DA' : 'url(#grad)'}
            fill={selectedCard ? 'rgba(85, 99, 218, .12)' : '#ffffff'}
            rx={10}
            ry={10}
            strokeLinecap="round"
          />
        </Svg>

        <Box mx={32} px={8} pt={8} height={'100%'} justifyContent="center">
          <Box
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between">
            <Box>
              <Text
                fontSize={16}
                variant="semiBold"
                color="#000000"
                letterSpacing={-0.2}
                allowFontScaling={false}>
                Group of {card.group_size}
              </Text>
              <Text
                variant="regular"
                color="grey200"
                lineHeight={24}
                letterSpacing={-0.2}
                allowFontScaling={false}>
                {userCurrency}
                {basePrice} x{card.group_size} tickets
              </Text>
            </Box>

            <Box>
              <Box flexDirection="row" alignItems="flex-start">
                <Text
                  allowFontScaling={false}
                  variant="medium"
                  fontSize={12}
                  lineHeight={12}>
                  {userCurrency}{' '}
                </Text>
                <Text
                  allowFontScaling={false}
                  variant="medium"
                  fontSize={20}
                  lineHeight={18}>
                  {card?.amountAfterOffer}
                </Text>
              </Box>

              <Box flexDirection="row" alignItems="flex-start">
                <Text
                  fontSize={10}
                  lineHeight={10}
                  variant="medium"
                  color="primaryBlue"
                  allowFontScaling={false}>
                  {userCurrency}{' '}
                </Text>
                <Text
                  variant="medium"
                  color="primaryBlue"
                  allowFontScaling={false}
                  textDecorationLine="line-through">
                  {maxPrice}
                </Text>
              </Box>
            </Box>
          </Box>

          {false && (
            <>
              <Box borderTopWidth={0.5} borderTopColor="grey300" my={16} />
              <Box flexDirection="row">
                <Box
                  borderRadius={16}
                  height={20}
                  width={20}
                  bg="grey200"
                  mr={8}
                />
                <Box flex={1}>
                  <Text
                    variant="regular"
                    fontSize={13}
                    letterSpacing={-0.2}
                    allowFontScaling={false}>
                    Offer valid till 31st December
                  </Text>
                </Box>
                <Box>
                  {/* <Text
                variant="medium"
                allowFontScaling={false}
                color="primaryBlue">
                View details
              </Text> */}
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    );
  };

  const orderConfirmHandler = async () => {
    // setIsButtonLoading(true);
    navigation.navigate('ConfirmDetailsScreen', {
      event,
      orderData: 'res.data',
    });

    try {
      // let res = await createOrder({
      //   data: {
      //     booking_id: booking_id,
      //     total_quantity: sumValues(memberCount),
      //     quantities: [
      //       ...groupTypes.map(type => {
      //         return {
      //           unit_type: type,
      //           //@ts-ignore
      //           quantity: memberCount[type],
      //         };
      //       }),
      //     ],
      //   },
      // });
      // if (res.status === 200) {
      //   navigation.navigate('ConfirmDetailsScreen', {
      //     event,
      //     orderData: res.data,
      //   });
      //   setIsButtonLoading(false);
      // } else {
      //   setIsButtonLoading(false);
      //   apiErrorRef.current.showModal(res?.data?.detail);
      // }
    } catch (error) {
      setIsButtonLoading(false);
      apiErrorRef?.current?.showModal(JSON.stringify(error));
    }
  };

  return (
    <Screen pt={32} flex={1} width={W} bg="primaryWhite">
      <Header
        pt={8}
        title="Book tickets"
        rightElement={
          <Text
            variant="medium"
            fontSize={14}
            color="grey100"
            textDecorationLine="underline"
            onPress={clearCounter}>
            Clear all
          </Text>
        }
      />
      <ScrollView contentContainerStyle={{paddingBottom: 350}}>
        <TicketDetails visible={!isTicketCollapsed || !totalMemberCount} />
      </ScrollView>

      <TicketCounter
        event={event}
        offerResponse={offerResponse}
        offerAppliedId={offerAppliedId}
        isDataFetching={isDataFetching}
        buttonLoading={isButtonLoading}
        totalMemberCount={totalMemberCount}
        onConfirmPress={orderConfirmHandler}
      />

      <ErrorHandlingModal
        ref={apiErrorRef}
        description="Something went wrong"
        onPress={() => apiErrorRef?.current?.hideModal()}
        onClose={() => apiErrorRef?.current?.hideModal()}
      />
    </Screen>
  );
};

export default TicketBookingScreen;
