import React from 'react';

import {Box, Text, W} from '../../Constants/Theme';
import ReturnLogo from '../../functions/returnLogo';

const FlashBanner = ({event = true, visible}) => {
  if (!visible) return null;
  return (
    <Box
      py="m"
      px="l"
      width="100%"
      borderTopLeftRadius={24}
      borderTopRightRadius={24}
      bg="green100"
      alignItems="center">
      <Box flexDirection="row" alignItems="center">
        <Box width={45} height="100%" position="relative">
          <Box top={-24} borderRadius={30} position="absolute" bg={'green100'}>
            <ReturnLogo width={40} height={40} type="percent" />
          </Box>
        </Box>

        <Box flex={1} flexDirection="row" alignItems="center">
          <Text
            fontSize={12}
            lineHeight={12}
            color="green500"
            variant="semiBold"
            letterSpacing={-0.2}>
            {event.flash_sale_text}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default FlashBanner;
