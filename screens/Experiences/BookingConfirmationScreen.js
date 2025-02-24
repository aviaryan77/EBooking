import React, {useState, useEffect, useRef} from 'react';
import {Image, ScrollView, ImageBackground} from 'react-native';

import moment from 'moment';
import QRCode from 'react-qr-code';
import ViewShot from 'react-native-view-shot';
import Back from '../../svg/general/backWhite.svg';
import SkLogo from '../../svg/experiences/splitkaro_transparent_logo.svg';
import {Box, H, Text, W} from '../../Constants/Theme';
import ReturnLogo from '../../functions/returnLogo';
import {
  openShareModalHandler,
  scratchCardShareWhatsappHandler,
} from '../../functions/referFriend';
import {
  Screen,
  Center,
  PendingLoader,
  ErrorHandlingModal,
} from '../../components/Restyle';

import {checkOrderStatus} from '../../helperFunctions/Api';

import {analytics} from '../../configs/analytics';
import Log from '../../helperFunctions/Log';
import {ShareTicketBottomSheet} from '../../components/experiences';

const BookingConfirmationScreen = ({route, navigation}) => {
  const {orderId} = route?.params;
  // const orderId = '63a17577b9fa1fc1fafea3e2';
  const isRedirectedFromActivity = route?.params?.redirectedFrom === 'activity';
  const apiErrorRef = useRef();
  const captureRef = useRef();

  const [event, setEvent] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const [orderStatus, setOrderStatus] = useState(''); // from BE, 'processing', 'success', 'failure'

  useEffect(() => {
    setDataLoading(true);
    checkOrder();
  }, []);

  let checkCount = 0;
  const checkOrder = async () => {
    checkCount++;
    try {
      const res = await checkOrderStatus({orderId});

      if (res?.status === 200) {
        setOrderResponse(res?.data);
        setEvent(res?.data?.listing_info);
        setOrderStatus(res?.data?.status);
        if (res?.data?.status === 'processing' && checkCount < 10) {
          setTimeout(() => {
            checkOrder();
          }, 2000);
        }
      } else {
        apiErrorRef?.current?.showModal(res?.data?.detail);
      }
      setDataLoading(false);
    } catch (error) {
      apiErrorRef?.current?.showModal(error);
      console.log(`error`, error);
      setDataLoading(false);
    }
  };

  const Header = () => {
    return (
      <Box
        pb="s"
        px="m"
        pt="m"
        alignItems="center"
        flexDirection="row"
        justifyContent="space-between">
        <Box flexDirection="row" alignItems="center">
          <Back
            width={28}
            height={28}
            marginRight={10}
            onPress={() => navigation.navigate('Home1')}
          />

          <Box>
            <Text
              fontSize={18}
              lineHeight={24}
              variant="semiBold"
              color="primaryWhite"
              textTransform="capitalize">
              {dataLoading || orderStatus == 'processing'
                ? ' Booking in process'
                : orderStatus == 'success'
                ? 'Booking Confirmed'
                : orderStatus == 'failure'
                ? 'Booking Failed'
                : ''}
            </Text>
          </Box>
        </Box>
      </Box>
    );
  };

  const FieldDetails = ({visible = true, fieldName, details}) => {
    if (!event) return null;
    return (
      <Box pt="m">
        <Text
          fontSize={12}
          lineHeight={14}
          variant="medium"
          allowFontScaling={false}>
          {fieldName}
        </Text>
        <Text
          fontSize={16}
          lineHeight={24}
          variant="semiBold"
          style={{color: '#666666'}}
          allowFontScaling={false}>
          {details}
        </Text>
      </Box>
    );
  };

  const captureAndShareScreenshot = () => {
    analytics.track('whatsapp share event click');
    captureRef?.current?.capture()?.then(data => {
      scratchCardShareWhatsappHandler({
        message:
          "Here's the ticket to the event booked via Splitkaro. Show this at the event entrance.",
        base64data: data,
      });
    });
  };

  const shareMessage = `Hey,

${event?.name} seems to be an exciting event. Let’s book this event on Splitkaro & avail Group Discounts!`;

  useEffect(() => {
    analytics.track('Booking Processing Page');
  }, []);

  if (dataLoading) {
    return (
      <Screen width={W} bg="primaryBlue">
        <>
          <PendingLoader style={{marginTop: 150}} size={150} />
          <Box alignItems="center" mt="m" px="m">
            <Text
              textAlign="center"
              variant="regular"
              fontSize={16}
              lineHeight={20}
              color="primaryWhite">
              Fetching your booking details
            </Text>
            <Text
              mt="s"
              fontSize={16}
              lineHeight={20}
              variant="regular"
              textAlign="center"
              color="primaryWhite">
              Please wait...
            </Text>
          </Box>
        </>
      </Screen>
    );
  }

  if (orderStatus !== 'success' && !isRedirectedFromActivity) {
    return (
      <Screen width={W} bg="primaryBlue">
        <>
          <PendingLoader style={{marginTop: 150}} size={150} />
          <Box alignItems="center" mt="m" px="m">
            <Text
              textAlign="center"
              variant="regular"
              fontSize={16}
              lineHeight={20}
              color="primaryWhite">
              Your booking is being processed...
            </Text>
            <Text
              mt="s"
              fontSize={16}
              lineHeight={20}
              variant="regular"
              textAlign="center"
              color="primaryWhite">
              Please wait while we confirm your booking!
            </Text>
          </Box>
        </>
      </Screen>
    );
  }

  //_________________main return________________//
  return (
    <Screen width={W} bg="primaryBlue">
      <Header />

      <Box alignItems="center">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 200}}>
          <ViewShot
            ref={captureRef}
            options={{
              format: 'jpg',
              quality: 0.9,
              result: 'base64',
              fileName: orderResponse?.booking_id ?? event?.name,
            }}>
            <ImageBackground
              source={require('../../assets/experiences/ticket_card_top.png')}
              resizeMode="cover"
              style={{justifyContent: 'center', width: 342, height: 310}}>
              <Box>
                <Box px="xl">
                  <Text
                    fontSize={20}
                    variant="bold"
                    lineHeight={24}
                    allowFontScaling={false}
                    textTransform="capitalize"
                    style={{color: '#161E64'}}>
                    {event?.name}
                  </Text>
                  <Text
                    fontSize={16}
                    lineHeight={24}
                    variant="semiBold"
                    allowFontScaling={false}
                    style={{color: '#32334C'}}>
                    {orderResponse?.total_quantity > 1
                      ? `${orderResponse?.total_quantity} Tickets`
                      : `${orderResponse?.total_quantity ?? 0} Ticket`}
                  </Text>
                  <FieldDetails
                    fieldName="Date and Time"
                    details={moment(event?.start_date)
                      ?.utcOffset('+05:30')
                      ?.format('Do MMMM | hh:mm a')}
                  />
                  <FieldDetails
                    fieldName="Venue"
                    details={event?.location?.city ?? 'NA'}
                  />
                  {orderStatus == 'success' && (
                    <FieldDetails
                      fieldName="Booking ID"
                      details={orderResponse?.ticket_code}
                    />
                  )}
                </Box>
              </Box>
            </ImageBackground>

            <ImageBackground
              source={require('../../assets/experiences/ticket_card_bottom.png')}
              resizeMode="cover"
              style={{
                justifyContent: 'center',
                width: 342,
                height: 340,
                top: -12,
              }}>
              <Box justifyContent="center" px="l">
                {orderStatus == 'success' ? (
                  <>
                    {orderResponse?.qr_code && (
                      <Box
                        style={{
                          width: 100,
                          height: 100,
                          alignSelf: 'center',
                        }}>
                        <QRCode
                          size={100}
                          style={{
                            height: 'auto',
                            maxWidth: '100%',
                            width: '100%',
                          }}
                          bgColor="transparent"
                          fgColor="#5765DB"
                          value={orderResponse?.qr_code ?? 'this is qr'}
                          logoBackgroundColor="transparent"
                        />
                      </Box>
                    )}
                    <Box px="l" mt="s">
                      <Text variant="regular" mt="m" allowFontScaling={false}>
                        Check your email ID{' '}
                        <Text
                          variant="regular"
                          color="primaryBlue"
                          allowFontScaling={false}>
                          {orderResponse?.user_details[0]?.email}
                        </Text>{' '}
                        for more details.
                      </Text>
                      <Text mt="m" variant="regular" allowFontScaling={false}>
                        For further help & assistance please contact{' '}
                        <Text
                          color="primaryBlue"
                          variant="regular"
                          allowFontScaling={false}>
                          {'support@splitkaro.com'}
                        </Text>
                      </Text>

                      <Box
                        mt="m"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box
                          height={4}
                          width={30}
                          my="s"
                          borderRadius={5}
                          style={{backgroundColor: 'rgba(22, 30, 99, 0.2)'}}
                        />
                        <Text
                          variant="regular"
                          fontSize={12}
                          allowFontScaling={false}>
                          Booked with
                        </Text>

                        <Box
                          mt={2}
                          flexDirection="row"
                          alignItems="center"
                          justifyContent="center">
                          <Text
                            variant="semiBold"
                            fontSize={16}
                            lineHeight={20}
                            color="primaryBlue"
                            allowFontScaling={false}>
                            Splitkaro
                          </Text>
                          <SkLogo width={20} height={20} marginLeft={4} />
                        </Box>
                      </Box>
                    </Box>
                  </>
                ) : null}
              </Box>
            </ImageBackground>
          </ViewShot>
        </ScrollView>
      </Box>

      <ShareTicketBottomSheet
        visible={orderStatus === 'success'}
        onWhatsappPress={captureAndShareScreenshot}
        onSharePress={() =>
          openShareModalHandler({
            title: `Share ticket to your friends`,
            message: shareMessage,
          })
        }
      />

      <ErrorHandlingModal
        ref={apiErrorRef}
        onPress={() => apiErrorRef.current.hideModal()}
        onClose={() => apiErrorRef.current.hideModal()}
      />
    </Screen>
  );
};

export default BookingConfirmationScreen;
