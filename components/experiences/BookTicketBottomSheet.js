import React from 'react';

import moment from 'moment';
import {Button} from '../Restyle';
import FlashBanner from './FlashBanner';
import {Box, Text, W} from '../../Constants/Theme';
import * as Animatable from 'react-native-animatable';
import {currencyFormat} from '../../helperFunctions/eventHelper';
import {userCurrency} from '../../helperFunctions/currencies';
import {AuthContext} from '../../contexts/authContext';

const BookTicketBottomSheet = ({event, buttonLoading, onBookTicketPress}) => {
  const {state} = React.useContext(AuthContext);
  const userData = JSON.parse(state.userData);
  return (
    <Animatable.View
      duration={500}
      animation={'fadeInUpBig'}
      style={{
        width: W,
        bottom: 0,
        elevation: 10,
        shadowRadius: 5,
        shadowOpacity: 0.7,
        paddingBottom: 24,
        shadowColor: '#000',
        position: 'absolute',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: 'white',
        shadowOffset: {width: 0, height: -5},
      }}>
      <FlashBanner event={event} />
      <Box
        mt="m"
        px="m"
        width={W}
        alignItems="center"
        flexDirection="row"
        justifyContent="space-around">
        <Box>
          <Text
            fontSize={22}
            lineHeight={24}
            variant="semiBold"
            color="primaryBlack"
            allowFontScaling={false}>
            {userCurrency(userData)} {currencyFormat(event?.price ?? 0)}
            <Text
              lineHeight={22}
              color="grey100"
              variant="semiBold"
              allowFontScaling={false}>
              /person
            </Text>
          </Text>

          {/* <Text variant="medium" color="grey200" allowFontScaling={false}>
            {moment(event?.start_date)
              ?.utcOffset('+05:30')
              ?.format('Do MMM, hh:mm a')}
          </Text> */}
        </Box>
        <Button
          width={W * 0.4}
          label="Book tickets"
          isLoading={buttonLoading}
          onPress={onBookTicketPress}
        />
      </Box>
    </Animatable.View>
  );
};

export default BookTicketBottomSheet;
