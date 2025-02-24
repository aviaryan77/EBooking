import React, {useState, useEffect, useRef} from 'react';
import {Pressable, ScrollView} from 'react-native';

import {Box, Text, W} from '../../Constants/Theme';
import {TicketCounter} from '../../components/experiences';
import Svg, {Stop, Defs, Rect, LinearGradient} from 'react-native-svg';
import {
  Header,
  Screen,
  Center,
  ErrorHandlingModal,
} from '../../components/Restyle';
import * as Animatable from 'react-native-animatable';

import {currencyFormat, debounce} from '../../helperFunctions/eventHelper';
import {createOrder, getPriceBreakup} from '../../helperFunctions/Api';

import {analytics} from '../../configs/analytics';
import Log from '../../helperFunctions/Log';
import {userCurrency} from '../../helperFunctions/currencies';
import {AuthContext} from '../../contexts/authContext';

const TicketBookingScreen = ({route, navigation}) => {
  const {event, booking_id} = route.params ?? {};

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
  const [totalMemberCount, setTotalMemberCount] = useState(0);
  const [isDataFetching, setIsDataFetching] = useState(false);
  const [offerResponse, setOfferResponse] = useState(null);

  let basePrice = event?.price;

  const apiErrorRef = useRef();
  const collapseRef = useRef();
  const counterTexRef = useRef();

  useEffect(() => {
    setOfferAppliedId('');
    let totalMember = sumValues(memberCount);
    setTotalMemberCount(totalMember);

    if (totalMember) debounce(() => getPrice(), 1000);
  }, [memberCount]);

  const getPrice = async () => {
    setIsDataFetching(true);

    try {
      let res = await getPriceBreakup({
        eventId: event?._id,
        data: {
          quantities: [
            ...groupTypes.map(type => {
              return {
                unit_type: type,
                quantity: memberCount[type],
              };
            }),
          ],
        },
      });

      if (res.status === 200) {
        setOfferResponse(res?.data);
        setOfferAppliedId(res?.data?.offer_applied_id);
        setIsDataFetching(false);
      } else {
        clearCounter();
        setIsDataFetching(false);
        apiErrorRef?.current?.showModal(res?.data?.detail);
      }
    } catch (error) {
      clearCounter();
      setIsDataFetching(false);
      apiErrorRef?.current?.showModal(JSON.stringify(error));
    }
  };

  const sumValues = obj => Object?.values(obj)?.reduce((a, b) => a + b, 0);

  let price_breakup = event?.price_breakup ?? {};
  let groupTypes = Object.keys(price_breakup ?? []); //'single', 'male',  'female', 'couple' from BE

  const onMinusPress = type => {
    setIsDataFetching(true);
    if (memberCount[type] > 0 && memberCount[type] <= maxMemberCount) {
      setMemberCount({
        ...memberCount,
        [type]: memberCount[type] - 1,
      });
    }
  };

  const onPlusPress = type => {
    setIsDataFetching(true);
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

  const TicketDetails = ({visible}) => {
    if (!visible) return null;
    return (
      <Box>
        {groupTypes?.map(type => {
          return (
            <Box
              px="l"
              pt="m"
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
                  color="primaryBlack"
                  textTransform="capitalize">
                  {type}
                </Text>
                <Text
                  fontSize={12}
                  variant="medium"
                  color="grey200"
                  textTransform="capitalize">
                  {`${userCurrency(userData)}${currencyFormat(
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
                    mr="m"
                    width={30}
                    height={30}
                    borderWidth={1}
                    borderRadius="m"
                    borderColor={
                      memberCount[type] > 0 ? 'primaryBlack' : 'grey300'
                    }>
                    <Text
                      variant="regular"
                      fontSize={16}
                      lineHeight={24}
                      allowFontScaling={false}
                      color={
                        memberCount[type] > 0 ? 'primaryBlack' : 'grey300'
                      }>
                      &#x2014;
                    </Text>
                  </Center>
                </Pressable>

                <Animatable.View
                  style={{width: 35, marginRight: -7}}
                  ref={counterTexRef}>
                  <Text variant="regular" mr="m" allowFontScaling={false}>
                    {memberCount[type]}
                  </Text>
                </Animatable.View>
                <Pressable
                  onPress={() => {
                    onPlusPress(type);
                    analytics.track('Plus Click');
                  }}>
                  <Center
                    width={30}
                    height={30}
                    borderWidth={1}
                    borderRadius="m"
                    borderColor={
                      memberCount[type] < maxMemberCount
                        ? 'primaryBlack'
                        : 'grey300'
                    }>
                    <Text
                      fontSize={24}
                      lineHeight={28}
                      variant="regular"
                      allowFontScaling={false}
                      color={
                        memberCount[type] < maxMemberCount
                          ? 'primaryBlack'
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

  const BookingCard = ({card}) => {
    const maxPrice = basePrice * card.group_size;
    const selectedCard = offerAppliedId == card?.id;
    const {state} = React.useContext(AuthContext);
    const userData = JSON.parse(state.userData);
    return (
      <Box mt="m" mx="m" py="m" height={150} borderRadius="s">
        {selectedCard && (
          <Box
            px="m"
            py="s"
            left={5}
            top={-12}
            zIndex={10}
            bg="primaryBlue"
            borderRadius="s"
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

        <Box mx="l" px="s" pt="s" height={'100%'} justifyContent="center">
          <Box
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between">
            <Box>
              <Text
                fontSize={16}
                variant="semiBold"
                color="primaryBlack"
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
                {userCurrency(userData)}
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
                  {userCurrency(userData)}{' '}
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
                  {userCurrency(userData)}{' '}
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
              <Box borderTopWidth={0.5} borderTopColor="grey300" my="m" />
              <Box flexDirection="row">
                <Box
                  borderRadius="m"
                  height={20}
                  width={20}
                  bg="grey200"
                  mr="s"
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
    setIsButtonLoading(true);

    try {
      let res = await createOrder({
        data: {
          booking_id: booking_id,
          total_quantity: sumValues(memberCount),
          quantities: [
            ...groupTypes.map(type => {
              return {
                unit_type: type,
                quantity: memberCount[type],
              };
            }),
          ],
        },
      });

      if (res.status === 200) {
        navigation.navigate('ConfirmDetailsScreen', {
          event,
          orderData: res.data,
        });
        setIsButtonLoading(false);
      } else {
        setIsButtonLoading(false);
        apiErrorRef.current.showModal(res?.data?.detail);
      }
    } catch (error) {
      setIsButtonLoading(false);
      apiErrorRef.current.showModal(JSON.stringify(error));
    }
  };

  return (
    // <TouchableWithoutFeedback onPress={()=>{
    //   console.log(`pressed`);
    //   setIsTicketCollapsed(true)}}>
    <Screen flex={1} width={W} bg="primaryWhite">
      <Header
        pt="s"
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
        onPress={() => apiErrorRef.current.hideModal()}
        onClose={() => apiErrorRef.current.hideModal()}
      />
    </Screen>
  );
};

export default TicketBookingScreen;
