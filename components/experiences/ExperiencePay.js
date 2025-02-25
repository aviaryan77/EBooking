// CLONED FROM SettleUpPay.js
// UI SAME AS SettleUpPay.js API Calls different

import React, {useState, useContext, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  Linking,
  Keyboard,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions
} from 'react-native';

import Alert from '../../newcomponent/alert';
import Loading from '../../newcomponent/loading';
import {DashedLine, ErrorHandlingModal} from '../../components/Restyle';
import CheckBlue from '../../svg/new/Check_Box2.svg';
import {useSetIdentify} from '../../atom/userProfile';
import MainButton from '../../newcomponent/mainButton';
import ReturnAvatar from '../../functions/ReturnAvatar';
import {WalletContext} from '../../contexts/walletContext';
import prettifyAmount from '../../functions/prettifyAmount';
import getRemoteValues from '../../functions/getRemoteValues';
import {useSplitkaroCashAtom} from '../../atom/useScratchCard';
import PartnerLogos from '../../paymentcomponents/partnerLogos';
// import IOSPaymentApps from '../../paymentcomponents/iosPaymentApps';
import MaintainStatus from '../../paymentcomponents/maintainStatus';
import {useNavigation, useRoute} from '@react-navigation/native';
import uuid from 'react-native-uuid';
import {checkOrderStatus, payOrder} from '../../helperFunctions/Api';
import UpiPaymentApps from './UpiPaymentApps';
import {Box} from '../../Constants/Theme';
import { userCurrency } from '../../helperFunctions/currencies';
import { AuthContext } from '../../contexts/authContext';

const ExperiencePay = ({
  event,
  amount,
  orderId,
  callback,
  setError,
  user_details,
  setPaymentStage,
  setPaymentStatusScreen,
}) => {
  const navigation = useNavigation();
  const route = useRoute();
  const [, setIdentifyFirstTime] = useSetIdentify();
  const windowWidth = Dimensions.get('window').width;
  const [loading, setLoading] = useState(false);
  const [insuf, setInsuf] = useState(false); //insufficient balance
  const {walletState, updateBalance, updateTransactions, resetTransactions} =
    useContext(WalletContext);
  const { state } = React.useContext(AuthContext);
  const userData = JSON.parse(state.userData);

  const [amountInput, setAmountInput] = useState(amount?.toString() ?? '');

  const walletBalance = prettifyAmount(walletState.balance);
  const [splitkaroCash, updateSplitkaroCash] = useSplitkaroCashAtom();
  const [walletBalanceSelected, setWalletBalanceSelected] = useState(
    walletBalance > 0 ? true : false,
  );
  const [splitkaroCashSelected, setSplitkaroCashSelected] = useState(false);
  const [moneyToPay, setMoneyToPay] = useState(''); // amount-(amountFromWallet+amountFromSplitkaroCash)
  const [amountFromWallet, setAmountFromWallet] = useState(0);
  const [amountFromSplitkaroCash, setAmountFromSplitkaroCash] = useState(0);
  const [upiLink, setUpiLink] = useState('');

  const apiErrorRef = useRef();
  const emptyAmountRef = useRef();
  const paymentAppsRef = useRef(null);

  //Remote Config
  const settle_up_wallet_enabled =
    getRemoteValues('settle_up_wallet').asString();
  const splitkaro_cash = getRemoteValues('splitkaro_cash').asBoolean();

  var callingCount = 0;

  const callSettlementCheck = () => {
    setPaymentStatusScreen(true);

    setTimeout(async () => {
      callingCount++;
      const settlementStatus = await checkOrderStatus({orderId});

      if (settlementStatus?.status == 'failure') {
        setPaymentStage('failure');
        setError(JSON.stringify(settlementStatus));
        updateTransactions(true);
      } else if (settlementStatus?.settlement_state == 'success') {
        setPaymentStage('success');
        updateBalance();
        updateSplitkaroCash();
        callback();
        resetTransactions();
        updateTransactions(true);
        navigation.navigate('BookingConfirmationScreen', {orderId});

        //identify in analytics that the user has settled
        setIdentifyFirstTime('hasSettledWithUPI'); // TO BE DISCUSS
      } else {
        // pending
        if (callingCount < 5) {
          callSettlementCheck();
        } else {
          setPaymentStage('server');
          resetTransactions();
          updateTransactions(true);
        }
      }
    }, 2000);
  };

  useEffect(() => {
    setMoneyToPay(Math.round(amount));
  }, [amount]);

  const settle = async () => {
    if (!amount) {
      showEmptyError();
      return null;
    }
    setLoading(true);

    var data = JSON.stringify({
      user_details: user_details,
      wallet_amount: amountFromWallet,
      splitkaro_cash: amountFromSplitkaroCash,
    });

    var nonce = uuid.v4();
    var string = 'friend.user_id' + nonce;

    settleFromWallet(data, string, nonce);
  };

  const settleFromWallet = async (data, string, nonce) => {
 

    const signature="none"

    const newObject = {
      ...JSON.parse(data),
      payment_meta: {nonce: nonce, signature: signature},
    };

    try {
      let res = await payOrder({data: newObject, orderId});

      if (res.status === 200) {
        setLoading(false);
        if (res?.data?.upi_collection_link) {
          setPaymentStage('updatingstatus');
          setUpiLink(res?.data?.upi_collection_link);
          showPaymentApps();
        } else if (res?.data?.state === 'TRANSACTION_PROCESSING_INITIATED') {
          callSettlementCheck();
        } else if (res?.data?.state === 'TRANSACTION_SUCCESSFUL') {
          navigation.navigate('BookingConfirmationScreen', {orderId});
        }
      } else {
        setLoading(false);
        setError('Something went wrong');
        apiErrorRef?.current?.showModal(res?.data?.detail);
      }
    } catch (error) {
      setLoading(false);
      setError('Something went wrong');
      apiErrorRef?.current?.showModal(error);
    }
  };

  const showPaymentApps = () => {
    if (Platform.OS == 'android') {
      Keyboard.dismiss();
      setTimeout(() => {
        paymentAppsRef?.current?.showBottom();
      });
    } else {
      paymentAppsRef?.current?.showBottom();
    }
  };

  useEffect(() => {
    calculateAmountAndPaymentMode();
  }, [splitkaroCashSelected, walletBalanceSelected, walletState]);

  const calculateAmountAndPaymentMode = () => {
    let leftAmount = 0;

    if (splitkaroCashSelected && !walletBalanceSelected) {
      //only splitkaroCash
      setAmountFromWallet(0);
      leftAmount = parseFloat(amount) - parseFloat(splitkaroCash?.data?.amount);
      if (leftAmount <= 0) {
        // sufficient splitkaro cash
        setAmountFromSplitkaroCash(parseFloat(amount));
        setMoneyToPay(0);
        setInsuf(false);
      } else {
        setMoneyToPay(Math.ceil(leftAmount));
        setAmountFromSplitkaroCash(parseFloat(splitkaroCash?.data?.amount));
        setInsuf(true);
      }
    } else if (!splitkaroCashSelected && walletBalanceSelected) {
      //only wallet
      setAmountFromSplitkaroCash(0);
      leftAmount = parseFloat(amount) - parseFloat(walletState.balance);
      if (leftAmount <= 0) {
        // sufficient wallet balance
        setAmountFromWallet(parseFloat(amount));
        setMoneyToPay(0);
        setInsuf(false);
      } else {
        setMoneyToPay(Math.ceil(leftAmount));
        setInsuf(true);
        setAmountFromWallet(parseFloat(walletState.balance));
      }
    } else if (splitkaroCashSelected && walletBalanceSelected) {
      //both selected
      let leftFromWallet =
        parseFloat(amount) - parseFloat(splitkaroCash?.data?.amount);
      if (leftFromWallet <= 0) {
        // total payment by splitkaroCash
        setAmountFromSplitkaroCash(parseFloat(amount));
        setMoneyToPay(0);
        setInsuf(false);
      } else {
        leftAmount =
          parseFloat(leftFromWallet) - parseFloat(walletState.balance);
        if (leftAmount <= 0) {
          // payment by splitkaro cash then left with wallet balance
          setAmountFromWallet(parseFloat(leftFromWallet));
          setAmountFromSplitkaroCash(parseFloat(splitkaroCash?.data?.amount));
          setMoneyToPay(0);
          setInsuf(false);
        } else {
          // payment by splitkaro cash + wallet balance + UPI
          setMoneyToPay(Math.ceil(leftAmount));
          setAmountFromWallet(parseFloat(walletState.balance));
          setAmountFromSplitkaroCash(parseFloat(splitkaroCash?.data?.amount));
          setInsuf(true);
        }
      }
    } else {
      // none selected
      setMoneyToPay(Math.ceil(parseFloat(amount)));
      setAmountFromWallet(0);
      setAmountFromSplitkaroCash(0);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      if (route && route.params && route.params.startSettlement == true) {
        settle();
      }
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation, route]);

  const showEmptyError = () => {
    emptyAmountRef.current.showAlert('Please enter a valid amount!!');
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handlePress = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      // Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  };

  useEffect(() => {
    updateBalance();
    updateSplitkaroCash();
  }, []);

  if (!settle_up_wallet_enabled)
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <MaintainStatus height={180} width={180}></MaintainStatus>
      </View>
    );

  //_________main return________//
  return (
    <>
      <View style={styles.container}>
        <View>
          <Text style={styles.receiverTextA}>To</Text>
          <View style={styles.receiver}>
          <View style={{width:windowWidth*.65}}>
            <Text style={styles.receiverTextB} allowFontScaling={false}>
              {capitalizeFirstLetter(event?.name)}
              </Text>
              </View>
            <Box
              overflow="hidden"
              style={{
                width: 50,
                height: 50,
                overflow: 'hidden',
                alignItems: 'center',
                borderRadius: 10,
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
                  width: 50,
                  height: 50,
                  resizeMode: 'cover',
                }}
              />
            </Box>
          </View>
          <View style={styles.inputSection}>
            <Text style={styles.inputBoxInitial}>{userCurrency(userData)} </Text>
            <View>
              <TextInput
                editable={false}
                value={amountInput}
                style={styles.inputBox}
                keyboardType={'numeric'}
                allowFontScaling={false}
                placeholder={'Enter amount'}
                onChangeText={setAmountInput}
                placeholderTextColor={'#999999'}
              />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <View
            style={{
              padding: 16,
              width: '100%',
              borderWidth: 1,
              borderRadius: 10,
              marginVertical: 16,
              borderColor: '#F6F6F6',
            }}>
            <>
              <View style={styles.footerHeading}>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    onPress={() =>
                      setWalletBalanceSelected(!walletBalanceSelected)
                    }>
                    {walletBalanceSelected == true ? (
                      <CheckBlue
                        style={{marginRight: 10}}
                        height={'20'}
                        width={'20'}
                      />
                    ) : (
                      <View style={styles.emptyRadio} />
                    )}
                  </Pressable>
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.fhTextA,
                      color: walletBalanceSelected ? '#090A0A' : '#999999',
                    }}>
                    {'Use Wallet Balance'}
                  </Text>
                </View>

                {walletState.walletHealth != 'mast' ? (
                  <Text allowFontScaling={false} style={styles.fhTextB}>
                    Unable to fetch{' '}
                  </Text>
                ) : (
                  <Text
                    allowFontScaling={false}
                    style={{
                      ...styles.fhTextB,
                      color: walletBalanceSelected ? '#090A0A' : '#999999',
                    }}>
                    {userCurrency(userData)} {walletBalance}
                  </Text>
                )}
              </View>

              {splitkaro_cash ? (
                <>
                  <DashedLine />

                  <View style={styles.footerHeading}>
                    <View style={{flexDirection: 'row'}}>
                      <Pressable
                        onPress={() => {
                          !splitkaroCashSelected &&
                            parseFloat(splitkaroCash?.data?.amount) >
                              parseFloat(amount) &&
                            setWalletBalanceSelected(false);
                          setSplitkaroCashSelected(!splitkaroCashSelected);
                        }}>
                        {splitkaroCashSelected == true ? (
                          <CheckBlue
                            style={{marginRight: 10}}
                            height={'20'}
                            width={'20'}
                          />
                        ) : (
                          <View style={styles.emptyRadio} />
                        )}
                      </Pressable>
                      <Text
                        allowFontScaling={false}
                        style={{
                          ...styles.fhTextA,
                          color: splitkaroCashSelected ? '#090A0A' : '#999999',
                        }}>
                        {'Using Splitkaro Cash'}
                      </Text>
                    </View>
                    {splitkaroCash.state == 'hasData' ? (
                      <Text
                        allowFontScaling={false}
                        style={{
                          ...styles.fhTextB,
                          color: splitkaroCashSelected ? '#090A0A' : '#999999',
                        }}>
                        {userCurrency(userData)} {splitkaroCash?.data?.amount?.toFixed(2)}
                      </Text>
                    ) : splitkaroCash.state == 'loading' ? (
                      <Text
                        allowFontScaling={false}
                        style={{...styles.fhTextB, color: '#999999'}}>
                        loading...
                      </Text>
                    ) : (
                      <Text
                        allowFontScaling={false}
                        style={{...styles.fhTextB, color: '#999999'}}>
                        Unable to fetch{' '}
                      </Text>
                    )}
                  </View>
                </>
              ) : null}
            </>
          </View>

          {!loading ? (
            <>
              {insuf ||
              (walletBalanceSelected == false &&
                splitkaroCashSelected == false) ? (
                <MainButton
                  disabled={parseInt(moneyToPay) > 0 ? false : true}
                  // clicked={showPaymentApps}
                  clicked={settle}>
                  <Text style={styles.buttonText}>
                    Pay {moneyToPay > 0 ? `${userCurrency(userData)} ` + moneyToPay : 'now'}
                  </Text>
                </MainButton>
              ) : (
                <MainButton
                  disabled={parseInt(amount) > 0 ? false : true}
                  clicked={settle}>
                  <Text style={styles.buttonText}>Pay now</Text>
                </MainButton>
              )}
            </>
          ) : (
            <MainButton clicked={() => {}}>
              <Loading type={'dots'} height={4} width={4} />
            </MainButton>
          )}
          <View style={{marginBottom: 20}}>
            <PartnerLogos type={'settleup'} mode={'dark'}></PartnerLogos>
          </View>
        </View>

        <Alert
          type={'error'}
          alertHeader={'Invalid Amount'}
          ref={emptyAmountRef}
        />
      </View>
      <UpiPaymentApps
        orderId={orderId}
        type={'settlement'}
        amount={moneyToPay}
        ref={paymentAppsRef}
        upiLink={upiLink}
        event={event}
      />

      <ErrorHandlingModal
        ref={apiErrorRef}
        onPress={() => {
          apiErrorRef.current.hideModal();
          setError('');
        }}
        onClose={() => {
          setError('');
          apiErrorRef.current.hideModal();
        }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    marginHorizontal: 40,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  receiverTextA: {
    fontSize: 16,
    color: '#4D4D4D',
    fontFamily: 'Metropolis-Regular',
  },
  receiverTextB: {
    marginTop: 5,
    color: '#000000',
    fontSize: 18,
    marginRight: 15,
    paddingBottom: 10,
    fontFamily: 'Metropolis-Medium',
  },
  receiver: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSection: {
    paddingTop: 10,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#CCCCCC',
  },
  inputBox: {
    height: 40,
    color: 'black',
    fontSize: 18,
    minWidth: 200,
    fontFamily: 'Metropolis-SemiBold',
  },

  inputBoxInitial: {
    fontSize: 18,
    color: '#999999',
    fontFamily: 'Metropolis-SemiBold',
  },

  footer: {
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Metropolis-SemiBold',
  },
  footerHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fhTextA: {
    fontSize: 14,
    color: '#090A0A',
    fontFamily: 'Metropolis-Medium',
  },
  fhTextB: {
    fontSize: 14,
    color: '#4D4D4D',
    fontFamily: 'Metropolis-Bold',
  },

  emptyRadio: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderRadius: 5,
    marginRight: 10,
    alignItems: 'center',
    borderColor: '#5563DA',
    justifyContent: 'center',
  },
});

export default ExperiencePay;
