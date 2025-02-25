import React from 'react';

import {Center} from '../Restyle';
import {Box, Text, W} from '../../Constants/Theme';
import * as Animatable from 'react-native-animatable';
import ReturnLogo from '../../functions/returnLogo';

const ShareTicketBottomSheet = ({visible, onWhatsappPress, onSharePress}) => {
  if (!visible) return null;
  return (
    <Animatable.View
      duration={500}
      animation={'fadeInUpBig'}
      style={{
        width: W,
        bottom: 0,
        elevation: 10,
        shadowRadius: 5,
        shadowOpacity: .7,
        paddingBottom: 24,
        shadowColor: '#000',
        position: 'absolute',
        alignItems: 'center',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: 'white',
        shadowOffset: {width: 0, height: -5},
      }}>
      <Box
        mt="m"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Text variant="medium">Share ticket with friends</Text>

        <Box
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between">
          <ReturnLogo
            width={50}
            height={50}
            marginRight={8}
            type="whatsappWhiteOutline"
            onPress={onWhatsappPress}
          />
          {/* <Center width={40} height={40} bg="blue200" borderRadius={40}>
            <ReturnLogo
              height={30}
              width={30}
              type="shareLine"
              onPress={onSharePress}
            />
          </Center> */}
        </Box>
      </Box>
    </Animatable.View>
  );
};

export default ShareTicketBottomSheet;
