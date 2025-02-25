import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, Image} from 'react-native';
// import Image from 'react-native-scalable-image';

import moment from 'moment';
// import Back from '../../svg/new/back';
import {Box, Text, W,
  Screen,
  AddFieldModal,
  ErrorHandlingModal,

} from  '../../theme';
import {currencyFormat, sentenceCase, userCurrency} from '../../helpers/eventHelper';
import {ConfirmPay, 
  
} from '../../components/experiences';



import { GorhomBottomSheetRef } from '../../theme/GorhomBottomSheet';
import { BackIcon } from '../../svg/Icons';

const ConfirmDetailsScreen = ({route, navigation}:any) => {
  const {event, orderData} = route.params ?? {};
  const {
    unit_price,
    total_price,
    total_tax_breakup,
    convenience_fee,
    convenience_fee_discount,
    final_price,
    total_discount,
    offer_applied_id,
  } = orderData?.amount_breakup;
  const quantities = orderData.quantities;

  const errorRef = useRef(null);
  const settleRef = useRef(null);
  const mailErrorRef = useRef(null);
  const couponErrorRef = useRef<GorhomBottomSheetRef>(null);


  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [couponFieldVisible, setCouponFieldVisible] = useState(false);
  const [isEditMailModalVisible, setIsEditMailModalVisible] = useState(false);
  const [mailId, setMailId] = useState('example@gmail.com');
  const [tempMailValue, setTempMailValue] = useState(
     'example@gmail.com',
  );
  const [hasMailError, setHasMailError] = useState(false);

  const Header = () => {
    return (
      <Box
        pb="s"
        px="m"
        pt="m"
        bg="primaryWhite"
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

 

  const SectionText = ({text}:{text:string}) => (
    <Box py="m">
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
  }:any) => {
    if (!visible) return null;
    return (
      <Box my="s" pb="s">
        <Box flexDirection="row" justifyContent="space-between">
          <Text
            variant="semiBold"
            color="grey100"
            fontSize={14}
            lineHeight={24}>
            {fieldName}
          </Text>
          {editable && (
            <Text
              lineHeight={24}
              color="grey100"
              variant="semiBold"
              textDecorationLine="underline"
              onPress={() => setIsEditMailModalVisible(true)}>
              Edit
            </Text>
          )}
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

  const TotalTicket = ({visible}:{visible:boolean}) => {
    if (!visible) return null;

    var totalTicketCount = quantities.reduce(function (prev:number, cur:any) {
      return prev + cur.quantity;
    }, 0);

    return (
      <Box>
        <Box>
          {quantities
            ?.filter((type:any) => type?.quantity !== 0)
            .map((type:any, index:number) => {
              return (
                <Box
                  mt="s"
                  key={type?.unit_type}
                  alignItems="center"
                  flexDirection="row"
                  justifyContent="space-between">
                  <Text
                    variant="medium"
                    color="grey200"
                    lineHeight={24}
                    allowFontScaling={false}>
                    {` ${type?.quantity} ${sentenceCase(type?.unit_type)} x₹${
                      event?.price_breakup[type?.unit_type]?.unit_price
                    }`}
                  </Text>

                  <Text
                    variant="medium"
                    color="grey200"
                    lineHeight={24}
                    allowFontScaling={false}>
                    {`${userCurrency}${currencyFormat(
                      type?.quantity *
                        event?.price_breakup[type?.unit_type]?.unit_price,
                    )}`}
                  </Text>
                </Box>
              );
            })}
        </Box>

        {quantities?.filter((type:any) => type?.quantity !== 0)?.length > 1 && (
          <Box
            mt="s"
            alignItems="center"
            flexDirection="row"
            justifyContent="space-between">
            <Text
              fontSize={14}
              lineHeight={20}
              variant="medium"
              color="primaryBlack">
              {totalTicketCount > 1
                ? `Total ${totalTicketCount} tickets`
                : `Total ${totalTicketCount}  ticket`}
            </Text>

            <Text
              fontSize={14}
              lineHeight={20}
              variant="medium"
              color="primaryBlack">
              {userCurrency}{currencyFormat(total_price)}
            </Text>
          </Box>
        )}
      </Box>
    );
  };

  const isValidEmail = (email:string) => {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (email.match(regex)) return true;
    else return false;
  };

  const onMailCancel = () => {
    setTempMailValue(mailId);
    setIsEditMailModalVisible(false);
  };
  const onMailSave = () => {
    if (isValidEmail(tempMailValue)) {
      setHasMailError(false);
      setMailId(tempMailValue);
      setTempMailValue(tempMailValue);
      setIsEditMailModalVisible(false);
    } else {
      setHasMailError(true);
      // @ts-ignore
      mailErrorRef.current.showModal();
    }
  };

  const payButtonHandler = async () => {
     // @ts-ignore
    settleRef.current.showBottom();
  };

  return (
    <Screen flex={1} width={W} bg="primaryWhite">
      <Header />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        contentContainerStyle={{
          paddingBottom: 200,
        }}>
        <Box py="m" px="l" flexDirection="row">
          <Box
            style={{
              height: 80,
              width: 120,
              borderRadius: 12,
              overflow: 'hidden',
            }}>
            <Image
              source={{
                uri: !!event?.gallery[0]?.thumbnail
                  ? event?.gallery[0]?.thumbnail
                  : !!event?.gallery[0]?.url
                  ? event?.gallery[0]?.url
                  : 'https://firebasestorage.googleapis.com/v0/b/splitkaro-web.appspot.com/o/SplitkaroLogo.png?alt=media&token=ef424815-59c1-45bf-936a-33e4ee1045ec',
              }}
              style={{
                height: 80,
                width: 120,
                borderRadius: 10,
                resizeMode: 'contain',
              }}
            />
          </Box>

          <Box flex={1} pl="m" pt="m">
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
        <Box px="l">
          <SectionText text="Booking details" />
          <BookingSectionField
            fieldName="Date and time"
            detail={moment(event?.start_date)
              ?.utcOffset('+05:30')
              ?.format('Do MMM, hh:mm a')}
          />
          <BookingSectionField
            fieldName="No. of tickets"
            detail={`${orderData?.total_quantity} tickets `}
          />
          <BookingSectionField editable fieldName="Email Id" detail={mailId} />
        </Box>
        <Box bg="grey500" height={6}></Box>
        <Box px="l">
          <SectionText text="Pricing details" />
          <Box my="s">
            <TotalTicket visible={true} />

            <Box mt="s" flexDirection="row" justifyContent="space-between">
              <Text lineHeight={24} variant="medium" color="darkGreen">
                Group Package
              </Text>
              <Text
                lineHeight={24}
                variant="medium"
                color="darkGreen"
                allowFontScaling={false}>
                you saved {userCurrency}{currencyFormat(total_discount)}
              </Text>
            </Box>

            <Box flexDirection="row" justifyContent="space-between" mt="s">
              <Text lineHeight={24} variant="medium" color="grey200">
                Taxes & fees
              </Text>
              <Text
                variant="medium"
                color="grey200"
                lineHeight={24}
                allowFontScaling={false}>
                {userCurrency}{total_tax_breakup?.value}
              </Text>
            </Box>

            <Box mt="s" flexDirection="row" justifyContent="space-between">
              {convenience_fee === convenience_fee_discount && (
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
                {`${userCurrency}${convenience_fee ? convenience_fee.toFixed(2) : '200.00'}`}
              </Text>
            </Box>

            <Box mt="s" flexDirection="row" justifyContent="space-between">
              <Text lineHeight={24} variant="bold" color="grey100">
                Total
              </Text>
              <Text
                lineHeight={24}
                variant="bold"
                color="grey100"
                allowFontScaling={false}>
                {`${userCurrency}${currencyFormat(final_price)}`}
              </Text>
            </Box>
            {total_discount > 0 && (
              <Box px="s" my="m" bg="lightGreen">
                <Text
                  variant="medium"
                  color="darkGreen"
                  fontSize={12}
                  lineHeight={24}>
                  Congrats! You’re saving a total of{' '}
                  {userCurrency}{''}
                  {currencyFormat(total_discount)} with Splitkaro
                </Text>
              </Box>
            )}
          </Box>
        </Box>

        {/* <Box bg="grey500" px="l" py="s">
          <Box my="s">
            <Box mt="s" flexDirection="row" justifyContent="space-between">
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
                mr="l"
                height={50}
                paddingLeft={0}
              />
              <Box
                paddingHorizontal="m"
                style={{backgroundColor: 'rgba(85, 99, 218, 0.12)'}}
                borderRadius="l"
                paddingVertical="s"
                onTouchEnd={() => couponErrorRef.current.showModal()}>
                <Text variant="semiBold" color="primaryBlue">
                  Apply
                </Text>
              </Box>
            </Box>
          </Box>
        </Box> */}

        {orderData?.cancellation_policy && (
          <Box px="l">
            <SectionText text="Cancellation Policy" />
            <Box px="s">
              <Text variant="medium" color="grey200" lineHeight={24}>
                {orderData?.cancellation_policy}
              </Text>
            </Box>
          </Box>
        )}
      </ScrollView>

      <AddFieldModal
        title="Edit Email"
        confirmLabel="Save"
        cancelLabel="Cancel"
        value={tempMailValue}
        onClose={onMailCancel}
        placeholder="Add Email"
        hasError={hasMailError}
        // fieldText="Edit mail"
        setValue={setTempMailValue}
        onConfirmPress={onMailSave}
        onCancelPress={onMailCancel}
        onOverlayPress={onMailCancel}
        visible={isEditMailModalVisible}
      />

      <ConfirmPay
        buttonLoading={isButtonLoading}
        totalAmount={final_price}
        onConfirmPress={payButtonHandler}
      />
      {/* <BottomSheetModalProvider>
        <PaymentBottomSheet
          ref={settleRef}
          //@ts-ignore
          event={event}
          amount={final_price}
          orderId={orderData?._id}
          user_details={[
            {
              email: mailId,
              phone: '9431210691', // optional
            },
          ]}
          callback={() => {}}
        />
     </BottomSheetModalProvider> */}
      <ErrorHandlingModal
        ref={couponErrorRef}
        //@ts-ignore
        description="Invalid Coupon code"        onPress={() => couponErrorRef.current.hideModal()}        onClose={() => couponErrorRef.current.hideModal()}
      />
      <ErrorHandlingModal
        ref={mailErrorRef}
        //@ts-ignore
        description="Invalid Email Address"    onPress={() => mailErrorRef.current.hideModal()}        onClose={() => mailErrorRef.current.hideModal()}
      />
      <ErrorHandlingModal
        ref={errorRef}
        //@ts-ignore
        onPress={() => errorRef.current.hideModal()}  onClose={() => errorRef.current.hideModal()}
      />
    </Screen>
  );
};

export default ConfirmDetailsScreen;
