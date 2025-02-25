// CLONED FROM SettleUpBottomSheet.js
// UI SAME AS SettleUpPay.js (InstantBills) i.e no record payment tabs

import React, {
  useRef,
  useState,
  useEffect,
  useContext,
  useImperativeHandle,
} from 'react';
import {Text, View, Pressable, StyleSheet, BackHandler} from 'react-native';

import {Center} from '../Restyle';
import {W} from '../../Constants/Theme';
import GorhomBottomSheet from '../Shared/GorhomBottomSheet';
import ExperiencePay from './ExperiencePay'; //SettleUpPay
import {ToggleTabContext} from '../../contexts/toggleTabContext';
import PaymentStatus from '../../paymentcomponents/paymentStatus';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

const PaymentBottomSheet = React.forwardRef((props, ref) => {
  const sheetRef = useRef(null);

  const {toggleTabState, toggleTab} = useContext(ToggleTabContext);

  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [maskVisible, setMask] = useState(false);
  const [userErrorText, setUserErrorText] = useState('');
  const [paymentStage, setPaymentStage] = useState('inprocess'); // 'inprocess', 'success', 'failure', 'server', 'updatingstatus'
  const [paymentStatusScreen, setPaymentStatusScreen] = useState(false);

  useImperativeHandle(ref, () => ({
    showBottom: () => {
      sheetRef.current.present();
      setMask(true);
    },
  }));

  useEffect(
    () =>
      navigation.addListener('beforeRemove', e => {
        if (maskVisible) {
          e.preventDefault();
          sheetRef.current.dismiss(2);

          setPaymentStatusScreen(false);
          setPaymentStage('inprocess');
          setError('');
          setUserErrorText('');
        }
      }),
    [navigation, maskVisible],
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (maskVisible) {
          setMask(false);
          sheetRef.current.dismiss();

          setPaymentStatusScreen(false);
          setPaymentStage('inprocess');
          setError('');
          setUserErrorText('');
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

  useEffect(() => {
    if (paymentStage == 'failure' && error != '') {
      let errorNew = JSON.parse(error);

      if (errorNew && errorNew.title) {
        if (
          errorNew.title.match(
            /\bOne settlement is already in progress with this friend?\b/,
          )
        ) {
          setUserErrorText(errorNew.title);
        }
      }
    }
  }, [error]);

  const renderContent = () => {
    if (!maskVisible) return null;

    return (
      <View style={styles.container}>
        <View style={styles.tabs}>
          {paymentStatusScreen == true ? (
            <View style={styles.stageScreen}>
              {paymentStage == 'inprocess' && (
                <Center>
                  <PaymentStatus height={300} width={300} type={paymentStage} />
                  <Text
                    style={{
                      fontFamily: 'Metropolis-SemiBold',
                      fontSize: 20,
                      marginTop: -90,
                      marginLeft: 20,
                    }}>
                    Processing payment
                  </Text>
                </Center>
              )}

              {paymentStage == 'updatingstatus' && (
                <Center>
                  <PaymentStatus height={300} width={300} type={'inprocess'} />
                  <Text
                    style={{
                      fontSize: 20,
                      marginTop: -90,
                      marginLeft: 20,
                      fontFamily: 'Metropolis-SemiBold',
                    }}>
                    Updating status
                  </Text>
                </Center>
              )}

              {paymentStage == 'failure' && (
                <Center style={{marginTop: 40}}>
                  <PaymentStatus height={150} width={150} type={paymentStage} />
                  <Text
                    style={{fontFamily: 'Metropolis-SemiBold', fontSize: 20}}>
                    Payment Failed
                  </Text>

                  {error?.split('logout')?.length > 1 ? (
                    <>
                      <Text
                        style={{
                          marginTop: 20,
                          color: '#5563DA',
                          fontFamily: 'Metropolis-Medium',
                        }}>
                        Multiple device login detected.
                      </Text>
                      <Text
                        style={{
                          marginTop: 5,
                          color: '#5563DA',
                          fontFamily: 'Metropolis-Medium',
                        }}>
                        Logout from other device.
                      </Text>
                    </>
                  ) : error?.split('Partial settlement')?.length > 1 ? (
                    <Text
                      style={{
                        marginTop: 20,
                        color: '#5563DA',
                        fontFamily: 'Metropolis-Medium',
                      }}>
                      Your balance has changed.
                    </Text>
                  ) : (
                    <Pressable
                      onPress={() => navigation.navigate('transactions')}>
                      <Center style={{marginTop: 15}}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: '#5563DA',
                            textDecorationStyle: 'solid',
                            textDecorationLine: 'underline',
                            fontFamily: 'Metropolis-SemiBold',
                          }}>
                          View Transaction Detail
                        </Text>
                      </Center>
                      {userErrorText !== '' ? (
                        <Center style={{marginTop: 15, paddingHorizontal: 40}}>
                          <Text
                            style={{
                              fontSize: 14,
                              color: '#4d4d4d',
                              textAlign: 'center',
                              alignItems: 'center',
                              fontFamily: 'Metropolis-Regular',
                            }}>
                            ⓘ {userErrorText}
                          </Text>
                        </Center>
                      ) : null}
                    </Pressable>
                  )}
                </Center>
              )}

              {paymentStage == 'success' && (
                <Center style={{marginTop: 40}}>
                  <PaymentStatus height={150} width={150} type={paymentStage} />
                  <Text
                    style={{
                      fontSize: 20,
                      fontFamily: 'Metropolis-SemiBold',
                    }}>
                    Settlement Successful!!
                  </Text>
                </Center>
              )}

              {paymentStage == 'server' && (
                <Center style={{marginTop: 40}}>
                  <PaymentStatus height={150} width={150} type={paymentStage} />
                  <Pressable
                    onPress={() => navigation.navigate('transactions')}>
                    <Center style={{marginTop: 15}}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#5563DA',
                          textDecorationStyle: 'solid',
                          textDecorationLine: 'underline',
                          fontFamily: 'Metropolis-SemiBold',
                        }}>
                        View Transaction Detail
                      </Text>
                    </Center>
                  </Pressable>
                </Center>
              )}
            </View>
          ) : (
            <ExperiencePay
              setError={setError}
              event={props.event}
              amount={props.amount}
              orderId={props?.orderId}
              callback={props.callback}
              expenseId={props.expenseId}
              startPage={props.startPage}
              user_details={props.user_details}
              setPaymentStage={setPaymentStage}
              setPaymentStatusScreen={setPaymentStatusScreen}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      {maskVisible && (
        <Pressable
          opacity={0.7}
          style={{
            ...styles.backDrop,
            height: '120%',
          }}
          onPress={() => {
            setError('');
            setMask(false);
            setUserErrorText('');
            sheetRef.current.dismiss();
            setPaymentStage('inprocess');
            setPaymentStatusScreen(false);
          }}
        />
      )}
      {/* <BottomSheet
        ref={sheetRef}
        snapPoints={[460, 460, -100]}
        borderRadius={25}
        renderContent={renderContent}
        initialSnap={2}
        onCloseEnd={() => {
          setMask(false);
          toggleTab(true);
        }}
        elevation={3}
        onOpenEnd={() => {}}
        enabledInnerScrolling={true}
      /> */}
      <GorhomBottomSheet
        ref={sheetRef}
        snapPoints={[460, 460]}
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
    height: 460,
    paddingTop: 10,
    alignItems: 'center',
    paddingHorizontal: 25,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'white',
  },
  backDrop: {
    width: '120%',
    position: 'absolute',
    backgroundColor: 'black',
  },
  tabs: {
    flex: 1,
    width: W,
    marginTop: 10,
  },
  stageScreen: {
    flex: 1,
    marginTop: 50,
    alignItems: 'center',
  },
});

export default PaymentBottomSheet;
