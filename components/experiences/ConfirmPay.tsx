import React, {useEffect, useRef} from 'react';

import {Box, Text, W} from '../../theme';
import * as Animatable from 'react-native-animatable';
import {Button, } from'../../theme';
import {currencyFormat, userCurrency} from '../../helpers/eventHelper';

const ConfirmPay = ({totalAmount, onConfirmPress, buttonLoading}:any) => {
  const ButtonContainer = ({visible}:{
    visible: boolean
  }) => {
    if (!visible) return null;
    return (
      <Box
        mt={16}
        px={32}
        width={W}
        alignItems="center"
        flexDirection="row"
        justifyContent="space-around">
        <Box flex={1}>
          <Text
            fontSize={22}
            lineHeight={30}
            variant="semiBold"
            color="#000000"
            allowFontScaling={false}>
            {userCurrency} {currencyFormat(totalAmount)}
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
          title="Book now"
          onPress={()=>{
            onConfirmPress();
          }}
          loading={buttonLoading}
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
