// CLONED FROM iosPaymentApps.js

import React, {useRef, useState, useEffect, useImperativeHandle} from 'react';
import {
  View,
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  BackHandler,
} from 'react-native';

import {Center} from '../Restyle';
import {Text, W} from '../../Constants/Theme';
import FastImage from 'react-native-fast-image';
import GorhomBottomSheet from '../Shared/GorhomBottomSheet';
import ReturnLogo from '../../functions/returnLogo';
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';


const UpiPaymentApps = React.forwardRef((props, ref) => {
  const sheetRef = useRef(null);
  const navigation = useNavigation();

  const [gpay, setGpay] = useState(false);
  const [paytm, setPaytm] = useState(false);
  const [phonepe, setPhonepe] = useState(false);
  const [maskVisible, setMask] = useState(false);
  const [whatsapp, setWhatsapp] = useState(false);
  const [paytmAndroid, setPaytmAndroid] = useState(false);

  useImperativeHandle(ref, () => ({
    showBottom: () => {
      sheetRef?.current?.present();
      setMask(true);
    },
  }));

  const routeName = useRoute().name;

  useEffect(() => {
    async function checkSupport() {
      const phonepeSupported = await Linking.canOpenURL('phonepe://upi/pay');
      const whatsappSupported = await Linking.canOpenURL('whatsapp://upi/pay');
      const gpaySupported = await Linking.canOpenURL('gpay://upi/pay');
      const paytmSupported = await Linking.canOpenURL('paytm://upi/pay');
      if (Platform.OS == 'android') {
        const androidPaytmSupported = await Linking.canOpenURL('paytmmp://');
        setPaytmAndroid(androidPaytmSupported);
      }

      setPhonepe(phonepeSupported);
      setWhatsapp(whatsappSupported);
      setGpay(gpaySupported);
      setPaytm(paytmSupported);
    }

    checkSupport();
  }, []);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (maskVisible) {
        // e.preventDefault();
        sheetRef?.current?.dismiss();
      }
    });
  }, [navigation, maskVisible]);

  const hideBottom = () => {
    setTimeout(() => {
      setMask(false);
      sheetRef?.current?.dismiss();
    }, 400);
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (maskVisible) {
          setMask(false);
          sheetRef?.current?.dismiss();
          return true;
        } else {
          return false;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [maskVisible]),
  );

  const PaymentAppComponent = ({paymentAppType, paymentAppName, children}) => {
    return (
      <Pressable
        onPress={() => {
          hideBottom();
          navigation.navigate('CheckEventPaymentStatusScreen', {
            orderId: props?.orderId,
            amount: props.amount,
            paymentapp: paymentAppType,
            upiLink: props?.upiLink,
            event: props.event,
          });
        }}>
        <Center
          mr="s"
          mb="s"
          width={70}
          borderRadius={10}
          alignSelf="flex-start"
          style={{width: 70, backgroundColor: '#E9EBFD'}}>
          <Center
            my={10}
            width={35}
            height={35}
            borderRadius={10}
            bg="primaryWhite">
            {paymentAppType ? (
              <ReturnLogo height={28} width={28} type={paymentAppType} />
            ) : (
              children
            )}
          </Center>
          <Text variant="semiBold" fontSize={10} lineHeight={12} mb="s">
            {paymentAppName}
          </Text>
        </Center>
      </Pressable>
    );
  };

  const renderContent = () => {
    if (!maskVisible) return null;
    return (
      <View style={{...styles.container}}>
        <View style={{paddingTop: 10}}>
          <Text variant="semiBold">UPI apps</Text>
        </View>
        <View
          style={{
            flex: 1,
            paddingTop: 10,
            flexWrap: 'wrap',
            flexDirection: 'row',
          }}>
          {phonepe && (
            <PaymentAppComponent
              paymentAppName="PhonePe"
              paymentAppType="phonepe"
            />
          )}

          {whatsapp && (
            <PaymentAppComponent
              paymentAppName="WhatsApp"
              paymentAppType="whatsapp"
            />
          )}

          {gpay && (
            <PaymentAppComponent paymentAppName="Gpay" paymentAppType="gpay" />
          )}

          {(paytm || paytmAndroid) && (
            <PaymentAppComponent
              paymentAppName="Paytm"
              paymentAppType="paytm"
            />
          )}

          {Platform.OS == 'android' && (
            <PaymentAppComponent paymentAppName="Others">
              <FastImage
                style={{height: 28, width: 28}}
                source={require('../../svg/new/upi.png')}
              />
            </PaymentAppComponent>
          )}
        </View>
      </View>
    );
  };

  //______________main return _____________//
  return (
    <>
      {/* <BottomSheet
        elevation={4}
        ref={sheetRef}
        initialSnap={2}
        borderRadius={25}
        onOpenEnd={() => {}}
        enabledInnerScrolling={true}
        snapPoints={[355, 355, -100]}
        renderContent={renderContent}
        onCloseEnd={() => setMask(false)}
      /> */}
      <GorhomBottomSheet
        ref={sheetRef}
        snapPoints={[355, 355]}
        panDownToClose={true}
        enableDynamicSizing={true}
        backdropPressBehavior="close"
        onClose={() => {
          setMask(false);
        }}>
        {renderContent}
      </GorhomBottomSheet>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    height: 355,
    paddingTop: 10,
    borderWidth: 5,
    paddingHorizontal: 25,
    borderColor: '#E9EBFD',
    borderTopLeftRadius: 20,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
  },
  backDrop: {
    width: '120%',
    height: '120%',
    position: 'absolute',
    backgroundColor: 'black',
  },
  tabs: {
    flex: 1,
    width: W,
    marginTop: 10,
  },
});

export default UpiPaymentApps;
