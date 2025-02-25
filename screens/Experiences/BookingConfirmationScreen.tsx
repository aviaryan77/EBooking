import React, {useState, useEffect, useRef} from 'react';
import {Image, ScrollView, ImageBackground} from 'react-native';

import moment from 'moment';
// import QRCode from 'react-qr-code';
// import ViewShot from 'react-native-view-shot';
import {Box, H, Text, W} from  '../../theme';

import {
  Screen,
  Center,
  ErrorHandlingModal,
} from '../../theme';
import { BackIcon } from '../../svg/Icons';



const BookingConfirmationScreen = ({route, navigation}:any) => {
  const {orderId} = route?.params;
  // const orderId = '63a17577b9fa1fc1fafea3e2';
  const isRedirectedFromActivity = route?.params?.redirectedFrom === 'activity';
  const apiErrorRef = useRef(null);
  const captureRef = useRef(null);

  const [event, setEvent] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState(null);
  const [orderStatus, setOrderStatus] = useState(''); // from BE, 'processing', 'success', 'failure'

 


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
          <BackIcon
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

  const FieldDetails = ({visible = true, fieldName, details}:any) => {
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

  

  const shareMessage = `Hey,

${event?.name} seems to be an exciting event. Let’s book this event on Splitkaro & avail Group Discounts!`;



  if (dataLoading) {
    return (
      <Screen width={W} bg="primaryBlue">
        <>

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
          
        </ScrollView>
      </Box>

   

      <ErrorHandlingModal
        ref={apiErrorRef}
              // @ts-ignore
        onPress={() => apiErrorRef.current.hideModal()}        onClose={() => apiErrorRef.current.hideModal()}
      />
    </Screen>
  );
};

export default BookingConfirmationScreen;
