import React, {useState, useContext, useEffect, useRef} from 'react';
import {Linking, Platform} from 'react-native';
import {
  Center,
  Screen,
  ErrorHandlingModal,
  HeaderWithBackButton,
} from '../../components/Restyle';

import {H, W, Text, Box} from '../../Constants/Theme';
import {StackActions} from '@react-navigation/native';
import {AuthContext} from '../../contexts/authContext';
import {WalletContext} from '../../contexts/walletContext';
import PaymentStatus from '../../paymentcomponents/paymentStatus';

import {analytics} from '../../configs/analytics';
import {checkOrderStatus} from '../../helperFunctions/Api';
import {useSplitkaroCashAtom} from '../../atom/useScratchCard';

const popAction = StackActions.pop(1);
const popAction2 = StackActions.pop(2);

const CheckEventPaymentStatusScreen = ({navigation, route}) => {
  const {
    event,
    amount,
    upiLink,
    orderId,
    paymentapp = 'upi',
  } = route.params ?? {};

  const {state} = useContext(AuthContext);
  const {token: userToken} = JSON.parse(state.userData);
  const {walletState, updateBalance, updateTransactions, resetTransactions} =
    useContext(WalletContext);
  const [splitkaroCash, updateSplitkaroCash] = useSplitkaroCashAtom();

  const [paymentMessage, setPaymentMessage] = useState('');
  const [paymentStage, setPaymentStage] = useState('inprocess'); // inprocess, server, success, failure

  const apiErrorRef = useRef();

  useEffect(() => {
    if (!!upiLink) {
      console.log(`upiLink`, upiLink);
      analytics.track('Payment link generated');
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
      analytics.track('Event payment status check started');
    }
  }, [upiLink]);

  let transactionCount = 0;

  const transactionStatus = async () => {
    setTimeout(async () => {
      transactionCount++;
      try {
        const settlementStatus = await checkOrderStatus({orderId});
        if (settlementStatus?.status === 200) {
          if (settlementStatus?.data?.status == 'failure') {
            resetTransactions();
            updateTransactions(true);
            setTimeout(() => {
              setPaymentStage('failure');
            }, 1000);
            analytics.track('paid money failure', {
              amount: amount,
              orderId: orderId,
            });
          } else if (settlementStatus?.data?.status == 'success') {
            setPaymentStage('success');
            updateBalance();
            updateSplitkaroCash();
            resetTransactions();
            updateTransactions(true);
            navigation.navigate('BookingConfirmationScreen', {orderId});
            analytics.track('Money paid successfully', {
              amount: amount,
              orderId: orderId,
            });
          } else {
            // pending
            if (transactionCount < 10) {
              transactionStatus();
            } else {
              resetTransactions();
              updateTransactions(true);
              setPaymentStage('server');
              setPaymentMessage('Transaction Pending');
              analytics.track('event payment pending', {
                amount: amount,
                orderId: orderId,
              });
            }
          }
        } else {
          apiErrorRef?.current?.showModal(res?.data?.detail);
        }
      } catch (error) {
        setTimeout(() => {
          resetTransactions();
          updateTransactions(true);
          setPaymentStage('server');
          apiErrorRef?.current?.showModal(!!error ? JSON.stringify(error) : '');
          setPaymentMessage('Something went wrong');
          analytics.track('Add money server error', {
            amount: amount,
            orderId: orderId,
            error: JSON.stringify(error),
          });
        }, 1000);
      }
    }, 2000);
  };

  return (
    <Screen>
      <HeaderWithBackButton
        onBackPress={() => navigation.dispatch(popAction)}
      />

      <Center flex={0.8} mx="m">
        <Center>
          {paymentStage == 'inprocess' && (
            <Center>
              <PaymentStatus height={300} width={300} type={paymentStage} />
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
              <PaymentStatus height={150} width={150} type={paymentStage} />
              <Text fontSize={20} lineHeight={24} variant="semiBold">
                Transaction Failed
              </Text>
            </Center>
          )}

          {paymentStage == 'success' && (
            <Center mt="xl">
              <PaymentStatus height={150} width={150} type={paymentStage} />
              <Text fontSize={20} lineHeight={24} variant="semiBold">
                Payment Done
              </Text>
            </Center>
          )}

          {paymentStage == 'server' && (
            <Center mt="xl">
              <PaymentStatus height={150} width={150} type={paymentStage} />
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
              color="primaryBlue"
              textDecorationStyle="solid"
              textDecorationLine="underline">
              View wallet
            </Text>
          </Center>
        )}
      </Center>

      <ErrorHandlingModal
        ref={apiErrorRef}
        onPress={() => {
          apiErrorRef.current.hideModal();
        }}
        onClose={() => apiErrorRef.current.hideModal()}
      />
    </Screen>
  );
};

export default CheckEventPaymentStatusScreen;
