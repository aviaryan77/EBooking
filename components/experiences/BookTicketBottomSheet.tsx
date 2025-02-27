import React from 'react';

import FlashBanner from './FlashBanner';
import {Box, Text, W, Button} from '../../theme';
import * as Animatable from 'react-native-animatable';
import {currencyFormat, userCurrency} from '../../helpers/eventHelper';

const BookTicketBottomSheet = ({
  event,
  buttonLoading,
  onBookTicketPress,
}: any) => {
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
        borderWidth: 1,
        borderColor: '#cacaca',
        shadowOffset: {width: 0, height: -5},
      }}>
      <FlashBanner event={event} />
      <Box
        mt={16}
        px={16}
        width={W}
        alignItems="center"
        flexDirection="row"
        justifyContent="space-around">
        <Box>
          <Text
            fontSize={22}
            lineHeight={24}
            variant="semiBold"
            color="#000000"
            allowFontScaling={false}>
            {userCurrency} {currencyFormat(event?.price ?? 0)}
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
          title="Book tickets"
          loading={buttonLoading}
          onPress={onBookTicketPress}
        />
      </Box>
    </Animatable.View>
  );
};

export default BookTicketBottomSheet;
