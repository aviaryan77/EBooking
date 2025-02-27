import React, {useState, useEffect, useRef} from 'react';
import {FlatList} from 'react-native';

import FlashOffer from './FlashOffer';
import {Box, Button, Text, W} from '../../theme';
import * as Animatable from 'react-native-animatable';
import {currencyFormat, userCurrency} from '../../helpers/eventHelper';


const TicketCounter = ({
  event,
  buttonLoading,
  offerResponse,
  onConfirmPress,
  offerAppliedId,
  isDataFetching,
  totalMemberCount,
}:any) => {
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    let matchedIdIndex = event?.bulk_booking_offers?.findIndex(
      // @ts-ignore
      item => item.id == offerAppliedId,
    );

    if (!!flatListRef?.current && matchedIdIndex >= 0) {
      flatListRef?.current?.scrollToIndex({
        animated: true,
        index: matchedIdIndex,
      });
    }
  }, [offerAppliedId]);

  const ConfirmContainer = ({visible}:{
    visible: boolean
  }) => {
    if (!visible) return null;
    return (
      <>
        <Box
          my={8}
          width="100%"
          bg="#ffffff"
          borderTopWidth={1}
          borderTopColor="grey400"
        />
        <Box
          mt={16}
          px={32}
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
                color="#000000"
                allowFontScaling={false}>
                {userCurrency}{currencyFormat(offerResponse?.final_price)}
              </Text>

              <Text
                variant="medium"
                color="#004AAD"
                textDecorationLine="line-through"
                allowFontScaling={false}>
                 {userCurrency}{currencyFormat(offerResponse?.total_price)}
              </Text>
            </Box>
          )}
          <Button
            width={W * 0.5}
            title="Confirm and pay"
            onPress={()=>{
              onConfirmPress();
            }}
            // loading={buttonLoading || isDataFetching}
          />
        </Box>
      </>
    );
  };

  const renderOfferCard = ({item, index}:{
    item: any
    index: number
  }) => {
    const selectedCard = offerAppliedId == item?.id;
    return (
      <Box
        mr={8}
        px={16}
        py={16}
        width={W * 0.6}
        borderWidth={1}
        borderRadius={8}
        bg={selectedCard ? 'green100' : '#ffffff'}
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
            (item:any) => item.id == offerAppliedId,
          )}
        />

        <FlatList
          horizontal
          ref={flatListRef}
          data={event?.bulk_booking_offers ?? []}
          keyExtractor={item => item?.id?.toString()}
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
