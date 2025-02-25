import React, {useEffect, useRef} from 'react';

import {Box, Text, W} from '../../Constants/Theme';
import * as Animatable from 'react-native-animatable';
import {Button, Center} from '../../components/Restyle';
import {currencyFormat} from '../../helperFunctions/eventHelper';
import { analytics } from '../../configs/analytics';
import { userCurrency } from '../../helperFunctions/currencies';
import { AuthContext } from '../../contexts/authContext';

const ConfirmPay = ({totalAmount, onConfirmPress, buttonLoading}) => {
  const { state } = React.useContext(AuthContext);
  const userData = JSON.parse(state.userData);
  const ButtonContainer = ({visible}) => {
    if (!visible) return null;
    return (
      <Box
        mt="m"
        px="l"
        width={W}
        alignItems="center"
        flexDirection="row"
        justifyContent="space-around">
        <Box flex={1}>
          <Text
            fontSize={22}
            lineHeight={30}
            variant="semiBold"
            color="primaryBlack"
            allowFontScaling={false}>
            {userCurrency(userData)} {currencyFormat(totalAmount)}
          </Text>

          <Text
            variant="medium"
            fontSize={12}
            color="grey200"
            allowFontScaling={false}>
            inclusive of all taxes & charges
          </Text>
        </Box>
        <Button
          width={W * 0.4}
          label="Pay now"
          onPress={()=>{
            onConfirmPress();
            analytics.track("Pay Now Clicked")
          }}
          isLoading={buttonLoading}
        />
      </Box>
    );
  };
  return (
    <Animatable.View
      animation={'fadeInUpBig'}
      duration={500}
      style={{
        width: W,
        bottom: 0,
        elevation: 10,
        shadowRadius: 5,
        shadowOpacity: .7,
        paddingBottom: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        position: 'absolute',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#fff',
        shadowOffset: {width: 0, height: 5},
        borderWidth: 0.5,
        borderColor: '#efefef',
      }}>
      <ButtonContainer visible={totalAmount > 0} />
    </Animatable.View>
  );
};

export default ConfirmPay;
