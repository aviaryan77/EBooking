import React from 'react';

import {Box, Text, W} from '../../theme';
import {currencyFormat} from '../../helpers/eventHelper';
import TickIcon from '../../svg/experiences/tick.svg';
import PercentStarIcon from '../../svg/experiences/percentStar.svg';

const FlashOffer = ({offerResponse, isOfferApplied, visible = true}:any) => {
  if (!visible) return null;
  return (
    <Box
      py={8}
      px={32}
      width="100%"
      borderTopLeftRadius={24}
      borderTopRightRadius={24}
      bg={isOfferApplied ? 'green500' : 'green100'}>
      <Box flexDirection="row" alignItems="center">
        <Box width={45} position="relative">
          <Box borderRadius={30} bg={isOfferApplied ? 'green500' : 'green100'}>
            {isOfferApplied ? (
              <TickIcon width={40} height={40} />
            ) : (
              <PercentStarIcon width={40} height={40} />
            )}
          </Box>
        </Box>
        {isOfferApplied ? (
          <Box flex={1}>
            <Text fontSize={12} variant="medium" color="#ffffff">
              {` Offer Applied! You’re saving ₹${currencyFormat(
                offerResponse?.total_discount,
              )} on this booking`}
            </Text>
          </Box>
        ) : (
          <Box flex={1}>
            <Text
              fontSize={14}
              color="green500"
              variant="medium"
              letterSpacing={-0.2}>
              App Exclusive Offers
            </Text>
            <Text
              fontSize={12}
              color="grey150"
              variant="regular"
              letterSpacing={-0.2}>
              Offer, if any, will be auto applied!
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default FlashOffer;
