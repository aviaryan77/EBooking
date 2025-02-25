import React, {useState, useEffect, useRef} from 'react';
import {FlatList} from 'react-native';

import FlashOffer from './FlashOffer';
import {Button} from '../../components/Restyle';
import {Box, Text, W} from '../../Constants/Theme';
import * as Animatable from 'react-native-animatable';
import {currencyFormat} from '../../helperFunctions/eventHelper';

import Log from '../../helperFunctions/Log';
import { analytics } from '../../configs/analytics';
import { userCurrency } from '../../helperFunctions/currencies';
import { AuthContext } from '../../contexts/authContext';

const TicketCounter = ({
  event,
  buttonLoading,
  offerResponse,
  onConfirmPress,
  offerAppliedId,
  isDataFetching,
  totalMemberCount,
}) => {
  const flatListRef = useRef();
  const { state } = React.useContext(AuthContext);
  const userData = JSON.parse(state.userData);

  useEffect(() => {
    let matchedIdIndex = event?.bulk_booking_offers?.findIndex(
      item => item.id == offerAppliedId,
    );

    if (!!flatListRef?.current && matchedIdIndex >= 0) {
      flatListRef?.current?.scrollToIndex({
        animated: true,
        index: matchedIdIndex,
      });
    }
  }, [offerAppliedId]);

  const ConfirmContainer = ({visible}) => {
    if (!visible) return null;
    return (
      <>
        <Box
          my="s"
          width="100%"
          bg="primaryWhite"
          borderTopWidth={1}
          borderTopColor="grey400"
        />
        <Box
          mt="m"
          px="l"
          width={W}
          alignItems="center"
          flexDirection="row"
          justifyContent="space-between">
          {isDataFetching ? (
            <Box />
          ) : (
            <Box>
              <Text
                fontSize={22}
                variant="semiBold"
                lineHeight={30}
                color="primaryBlack"
                allowFontScaling={false}>
                {userCurrency(userData)}{currencyFormat(offerResponse?.final_price)}
              </Text>

              <Text
                variant="medium"
                color="primaryBlue"
                textDecorationLine="line-through"
                allowFontScaling={false}>
                 {userCurrency(userData)}{currencyFormat(offerResponse?.total_price)}
              </Text>
            </Box>
          )}
          <Button
            width={W * 0.5}
            label="Confirm and pay"
            onPress={()=>{
              onConfirmPress();
              analytics.track("Confirm and Pay click",{name:event.name})
            }}
            isLoading={buttonLoading || isDataFetching}
          />
        </Box>
      </>
    );
  };

  const renderOfferCard = ({item, index}) => {
    const selectedCard = offerAppliedId == item?.id;
    return (
      <Box
        mr="s"
        px="m"
        py="m"
        width={W * 0.6}
        borderWidth={1}
        borderRadius="s"
        bg={selectedCard ? 'green100' : 'primaryWhite'}
        borderColor={selectedCard ? 'green500' : 'grey500'}>
        <Text variant="regular" color="grey150" fontSize={12}>
          {`Group of ${item?.group_size}`}
        </Text>
        <Text variant="regular" color="grey200" fontSize={10}>
          {item.text}
        </Text>
      </Box>
    );
  };

  return (
    <>
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
          // overflow: 'hidden',
          shadowColor: '#000',
          position: 'absolute',
          alignItems: 'center',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: '#FEFEFE',
          shadowOffset: {width: 0, height: -5},
          borderWidth: 0.5,
          borderColor: '#efefef',
        }}>
        <FlashOffer
          visible={true}
          offerResponse={offerResponse}
          isOfferApplied={event?.bulk_booking_offers?.some(
            item => item.id == offerAppliedId,
          )}
        />

        <FlatList
          horizontal
          ref={flatListRef}
          data={event?.bulk_booking_offers ?? []}
          key={item => item.id}
          renderItem={renderOfferCard}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginHorizontal: 20,
            paddingRight: 50,
            marginVertical: 16,
          }}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 700));
            wait.then(() => {
              flatListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
        />
        <ConfirmContainer visible={totalMemberCount > 0} />
      </Animatable.View>
    </>
  );
};

export default TicketCounter;
