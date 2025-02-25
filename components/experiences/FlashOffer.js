import React from 'react';

import {Box, Text, W} from '../../Constants/Theme';
import ReturnLogo from '../../functions/returnLogo';
import {currencyFormat} from '../../helperFunctions/eventHelper';
import TickIcon from '../../svg/experiences/tick.svg';
import PercentStarIcon from '../../svg/experiences/percentStar.svg';

const FlashOffer = ({offerResponse, isOfferApplied, visible = true}) => {
  if (!visible) return null;
  return (
    <Box
      py="s"
      px="l"
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
            <Text fontSize={12} variant="medium" color="primaryWhite">
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
              Splitkaro Exclusive Offers
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
