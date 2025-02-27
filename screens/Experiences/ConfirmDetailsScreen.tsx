import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, Image} from 'react-native';
// import Image from 'react-native-scalable-image';

import moment from 'moment';
import {
  W,
  Box,
  Text,
  Screen,
  AddFieldModal,
  ErrorHandlingModal,
  ErrorHandlingModalRef,
} from '../../theme';
import {
  currencyFormat,
  sentenceCase,
  userCurrency,
} from '../../helpers/eventHelper';
import {BackIcon} from '../../svg/Icons';
import {ConfirmPay} from '../../components/experiences';
import {GorhomBottomSheetRef} from '../../theme/GorhomBottomSheet';
import {PriceBreakupType} from '../../components/experiences/EVENT_DATA';
import Log from '../../services/Log';
import {useAppDispatch} from '../../store/ReduxHook';
import {updateMyBookings} from '../../store/actions';

const ConfirmDetailsScreen = ({route, navigation}: any) => {
  const dispatch = useAppDispatch();
  const {event, memberCount, offerResponse} = route.params ?? {};

  const quantities = memberCount
    ? Object.keys(memberCount).map(key => {
        return {
          unit_type: key,
          quantity: memberCount[key],
        };
      })
    : [];

  const errorRef = useRef<ErrorHandlingModalRef>(null);
  const settleRef = useRef<ErrorHandlingModalRef>(null);
  const couponErrorRef = useRef<ErrorHandlingModalRef>(null);

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [mailId, setMailId] = useState('example@gmail.com');

  type MemberType = 'single' | 'male' | 'female' | 'couple';

  const Header = () => {
    return (
      <Box
        pb={8}
        px={16}
        pt={16}
        bg="#ffffff"
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between">
        <Box flexDirection="row" alignItems="center">
          <BackIcon
            width={28}
            height={28}
            marginRight={10}
            onPress={() => navigation.goBack()}
          />
          <Box>
            <Text fontSize={18} lineHeight={24} variant="semiBold">
              Confirm details
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };

  const SectionText = ({text}: {text: string}) => (
    <Box py={16}>
      <Text variant="semiBold" fontSize={16} lineHeight={24}>
        {text}
      </Text>
    </Box>
  );

  const BookingSectionField = ({
    detail,
    editable,
    fieldName,
    visible = true,
  }: any) => {
    if (!visible) return null;
    return (
      <Box my={8} pb={8}>
        <Box flexDirection="row" justifyContent="space-between">
          <Text
            variant="semiBold"
            color="grey100"
            fontSize={14}
            lineHeight={24}>
            {fieldName}
          </Text>
        </Box>
        <Box flexDirection="row" justifyContent="space-between">
          <Text variant="medium" color="grey200" lineHeight={24}>
            {detail}
          </Text>
        </Box>
        <Box flexDirection="row"></Box>
      </Box>
    );
  };

  const TotalTicket = ({visible}: {visible: boolean}) => {
    if (!visible) return null;

    var totalTicketCount = quantities?.reduce(function (
      prev: number,
      cur: any,
    ) {
      return prev + cur.quantity;
    },
    0);

    return (
      <Box>
        <Box>
          {event.price_breakup
            ?.filter(
              (type: PriceBreakupType) => memberCount[type.type as any] !== 0,
            )

            ?.map((type: PriceBreakupType, index: number) => {
              return (
                <Box
                  mt={8}
                  key={type?.type}
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="space-between">
                  <Text
                    variant="medium"
                    color="grey200"
                    lineHeight={24}
                    allowFontScaling={false}>
                    {` ${memberCount[type.type as any]} ${sentenceCase(
                      type?.type,
                    )} x₹${type?.unit_price}`}
                  </Text>

                  <Text
                    variant="medium"
                    color="grey200"
                    lineHeight={24}
                    allowFontScaling={false}>
                    {`${userCurrency}${currencyFormat(
                      memberCount[type.type as any] * type?.unit_price,
                    )}`}
                  </Text>
                </Box>
              );
            })}
        </Box>

        {quantities?.filter((type: any) => type?.quantity !== 0)?.length >
          1 && (
          <Box
            mt={8}
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between">
            <Text
              fontSize={14}
              lineHeight={20}
              variant="medium"
              color="#000000">
              {totalTicketCount > 1
                ? `Total ${totalTicketCount} tickets`
                : `Total ${totalTicketCount}  ticket`}
            </Text>

            <Text
              fontSize={14}
              lineHeight={20}
              variant="medium"
              color="#000000">
              {userCurrency}
              {currencyFormat(offerResponse?.total_price)}
            </Text>
          </Box>
        )}
      </Box>
    );
  };

  const payButtonHandler = async () => {
    dispatch(
      updateMyBookings({
        data: {
          ...event,
          event_id: event.id,
          quantity: quantities,
          email: mailId,
          price: offerResponse.final_price,
          total_price: offerResponse.final_price,
          payment_status: 'pending',
          payment_id: '',
          payment_mode: 'online',
          payment_date: '',
          payment_expiry: '',
          booking_id: Math.floor(Math.random() * 1000000).toString(),
        },
        callback: (response: any) => {
          navigation.navigate('TabNavigator', {
            screen: 'Bookings',
          });
        },  
      }),
    );
  };

  return (
    <Screen flex={1} width={W} bg="#ffffff">
      <Header />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{
          paddingBottom: 200,
        }}>
        <Box py={16} px={32} flexDirection="row">
          <Box
            style={{
              height: 80,
              width: 120,
              borderRadius: 12,
              overflow: 'hidden',
            }}>
            <Image
              source={event?.gallery[0]?.thumbnail}
              style={{
                height: 80,
                width: 120,
                borderRadius: 10,
                resizeMode: 'cover',
              }}
            />
          </Box>

          <Box flex={1} pl={16} pt={16}>
            <Text fontSize={14} variant="semiBold">
              {event?.name}
            </Text>
            <Text
              variant="regular"
              color="grey200"
              fontSize={12}
              lineHeight={20}>
              {event?.location?.city}
            </Text>
          </Box>
        </Box>
        <Box px={32}>
          <SectionText text="Booking details" />
          <BookingSectionField
            fieldName="Date and time"
            detail={moment(event?.start_date)
              ?.utcOffset('+05:30')
              ?.format('Do MMM, hh:mm a')}
          />
          <BookingSectionField
            fieldName="No. of tickets"
            detail={`${offerResponse?.total_quantity} tickets `}
          />
          <BookingSectionField editable fieldName="Email Id" detail={mailId} />
        </Box>
        <Box bg="grey500" height={6}></Box>
        <Box px={32}>
          <SectionText text="Pricing details" />
          <Box my={8}>
            <TotalTicket visible={true} />

            <Box mt={8} flexDirection="row" justifyContent="space-between">
              <Text lineHeight={24} variant="medium" color="darkGreen">
                Group Package
              </Text>
              <Text
                lineHeight={24}
                variant="medium"
                color="darkGreen"
                allowFontScaling={false}>
                you saved {userCurrency}
                {currencyFormat(offerResponse?.total_discount)}
              </Text>
            </Box>

            <Box flexDirection="row" justifyContent="space-between" mt={8}>
              <Text lineHeight={24} variant="medium" color="grey200">
                Taxes & fees
              </Text>
              <Text
                variant="medium"
                color="grey200"
                lineHeight={24}
                allowFontScaling={false}>
                {userCurrency}
                {offerResponse.total_tax_breakup?.value ?? 0}
              </Text>
            </Box>

            <Box mt={8} flexDirection="row" justifyContent="space-between">
              {offerResponse?.convenience_fee ===
                offerResponse?.convenience_fee_discount && (
                <Box
                  top={9}
                  right={0}
                  width={60}
                  height={1.5}
                  position="absolute"
                  style={{
                    zIndex: 5,
                    backgroundColor: '#CE0E0E',
                    transform: [{rotate: '-7deg'}],
                  }}
                />
              )}

              <Text lineHeight={24} variant="medium" color="grey200">
                Convenience fee
              </Text>

              <Text
                variant="medium"
                color="grey200"
                lineHeight={24}
                allowFontScaling={false}>
                {`${userCurrency}${
                  offerResponse.convenience_fee
                    ? offerResponse.convenience_fee.toFixed(2)
                    : '200.00'
                }`}
              </Text>
            </Box>

            <Box mt={8} flexDirection="row" justifyContent="space-between">
              <Text lineHeight={24} variant="bold" color="grey100">
                Total
              </Text>
              <Text
                lineHeight={24}
                variant="bold"
                color="grey100"
                allowFontScaling={false}>
                {`${userCurrency}${currencyFormat(offerResponse.final_price)}`}
              </Text>
            </Box>
            {offerResponse.total_discount > 0 && (
              <Box px={8} my={16} bg="lightGreen">
                <Text
                  variant="medium"
                  color="darkGreen"
                  fontSize={12}
                  lineHeight={24}>
                  Congrats! You’re saving a total of {userCurrency}
                  {''}
                  {currencyFormat(offerResponse.total_discount)} with App
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* <Box bg="grey500" px={32} py={8}>
          <Box my={8}>
            <Box mt={8} flexDirection="row" justifyContent="space-between">
              <Text lineHeight={24} variant="semiBold" color="grey100">
                Apply Coupon
              </Text>
              <ChevronDown />
            </Box>
            <Box
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between">
              <RestyleTextInput
                flex={1}
                placeholder="Enter coupon code"
                mr={32}
                height={50}
                paddingLeft={0}
              />
              <Box
                paddingHorizontal={16}
                style={{backgroundColor: 'rgba(85, 99, 218, 0.12)'}}
                borderRadius={32}
                paddingVertical={8}
                onTouchEnd={() => couponErrorRef.current.showModal()}>
                <Text variant="semiBold" color="#004AAD">
                  Apply
                </Text>
              </Box>
            </Box>
          </Box>
        </Box> */}

        {offerResponse?.cancellation_policy && (
          <Box px={32}>
            <SectionText text="Cancellation Policy" />
            <Box px={8}>
              <Text variant="medium" color="grey200" lineHeight={24}>
                {offerResponse?.cancellation_policy}
              </Text>
            </Box>
          </Box>
        )}
      </ScrollView>

      <ConfirmPay
        buttonLoading={isButtonLoading}
        totalAmount={offerResponse?.final_price}
        onConfirmPress={payButtonHandler}
      />
      <ErrorHandlingModal
        ref={couponErrorRef}
        description="Invalid Coupon code"
        onPress={() => couponErrorRef?.current?.hideModal()}
        onClose={() => couponErrorRef?.current?.hideModal()}
      />

      <ErrorHandlingModal
        ref={errorRef}
        onPress={() => errorRef?.current?.hideModal()}
        onClose={() => errorRef?.current?.hideModal()}
      />
    </Screen>
  );
};

export default ConfirmDetailsScreen;
