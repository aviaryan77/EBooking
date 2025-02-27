import React, {useState, useContext, useEffect, useRef} from 'react';
import {Linking, Platform} from 'react-native';
import {
  Center,
  Screen,
  ErrorHandlingModal,
  HeaderWithBackButton,
} from '../../theme';

import {H, W, Text, Box} from '../../theme';
import {StackActions} from '@react-navigation/native';
// import PaymentStatus from '../../paymentcomponents/paymentStatus';

// import {checkOrderStatus} from '../../helperFunctions/Api';

const popAction = StackActions.pop(1);
const popAction2 = StackActions.pop(2);

const CheckEventPaymentStatusScreen = ({navigation, route}:any) => {
  const {
    event,
    amount,
    upiLink,
    orderId,
    paymentapp = 'upi',
  } = route.params ?? {};



  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentStage, setPaymentStage] = useState('inprocess'); // inprocess, server, success, failure

  const apiErrorRef = useRef(null);

  useEffect(() => {
    if (!!upiLink) {
      var link = upiLink;
      if (Platform.OS == 'ios' && link) {
        if (paymentapp == 'phonepe') {
          link = 'phonepe://upi/' + link.split('upi://')[1];
        }
        if (paymentapp == 'gpay') {
          link = 'gpay://upi/' + link.split('upi://')[1];
        }
        if (paymentapp == 'whatsapp') {
          link = 'whatsapp://upi/' + link.split('upi://')[1];
        }
        if (paymentapp == 'paytm') {
          link = 'paytm://upi/' + link.split('upi://')[1];
        }
      }

      if (Platform.OS == 'android' && link) {
        if (paymentapp == 'phonepe') {
          link = 'phonepe://' + link.split('upi://')[1];
        }
        if (paymentapp == 'gpay') {
          link = 'gpay://upi/' + link.split('upi://')[1];
        }
        if (paymentapp == 'whatsapp') {
          link = 'whatsapp://upi/' + link.split('upi://')[1];
        }
        if (paymentapp == 'paytm') {
          link = 'paytmmp://' + link.split('upi://')[1];
        }
      }

      Linking.openURL(link);

      setTimeout(() => {
        console.log(`setTimeout`);
        transactionStatus();
      }, 8000);
    }
  }, [upiLink]);

  let transactionCount = 0;

  const transactionStatus = async () => {
    setTimeout(async () => {
      transactionCount++;
      try {
        // const settlementStatus = await checkOrderStatus({orderId});
        // if (settlementStatus?.status === 200) {
        //   if (settlementStatus?.data?.status == 'failure') {
        //     setTimeout(() => {
        //       setPaymentStage('failure');
        //     }, 1000);
           
        //   } else if (settlementStatus?.data?.status == 'success') {
        //     setPaymentStage('success');
        //     navigation.navigate('BookingConfirmationScreen', {orderId});
           
        //   } else {
        //     // pending
        //     if (transactionCount < 10) {
        //       transactionStatus();
        //     } else {
        //       setPaymentStage('server');
        //       setPaymentMessage('Transaction Pending');
             
        //     }
        //   }
        // } else {
        //   //@ts-ignore
        //   apiErrorRef?.current?.showModal(res?.data?.detail);
        // }
      } catch (error) {
        setTimeout(() => {
          setPaymentStage('server');
          //@ts-ignore
          apiErrorRef?.current?.showModal(!!error ? JSON.stringify(error) : '');
          setPaymentMessage('Something went wrong');
          
        }, 1000);
      }
    }, 2000);
  };

  return (
    <Screen>
      <HeaderWithBackButton
        onBackPress={() => navigation.dispatch(popAction)}
      />

      <Center flex={0.8} mx={16}>
        <Center>
          {paymentStage == 'inprocess' && (
            <Center>
              {/* <PaymentStatus height={300} width={300} type={paymentStage} /> */}
              <Text
                fontSize={20}
                lineHeight={24}
                variant="semiBold"
                style={{marginTop: -90}}>
                Processing payment
              </Text>
            </Center>
          )}

          {paymentStage == 'failure' && (
            <Center mt="xl">
              {/* <PaymentStatus height={150} width={150} type={paymentStage} /> */}
              <Text fontSize={20} lineHeight={24} variant="semiBold">
                Transaction Failed
              </Text>
            </Center>
          )}

          {paymentStage == 'success' && (
            <Center mt="xl">
              {/* <PaymentStatus height={150} width={150} type={paymentStage} /> */}
              <Text fontSize={20} lineHeight={24} variant="semiBold">
                Payment Done
              </Text>
            </Center>
          )}

          {paymentStage == 'server' && (
            <Center mt="xl">
              {/* <PaymentStatus height={150} width={150} type={paymentStage} /> */}
              <Text fontSize={20} lineHeight={24} variant="semiBold">
                {paymentMessage}
              </Text>
            </Center>
          )}
        </Center>

        {paymentStage != 'inprocess' && (
          <Center onTouchEnd={() => navigation.navigate('transactions')}>
            <Text
              fontSize={15}
              lineHeight={18}
              variant="semiBold"
              color="#004AAD"
              textDecorationStyle="solid"
              textDecorationLine="underline">
              View wallet
            </Text>
          </Center>
        )}
      </Center>

      <ErrorHandlingModal
        ref={apiErrorRef}
        // @ts-ignore
        onPress={() =>  apiErrorRef.current.hideModal()} onClose={() => apiErrorRef.current.hideModal()}
      />
    </Screen>
  );
};

export default CheckEventPaymentStatusScreen;
