import React, {useState, useEffect, useRef} from 'react';
import {Animated, Image, Linking, Platform, Pressable} from 'react-native';

import moment from 'moment';
import {Box, Text, W, H} from '../../theme';
import * as Animatable from 'react-native-animatable';
import {
  Hero,
  BookTicketBottomSheet,
  ReadMoreBottomSheet,
} from '../../components/experiences';
import HTML from 'react-native-render-html';
import {Screen, ErrorHandlingModal, Center} from '../../theme';

import LanguageIcon from '../../svg/experiences/language.svg';
import CapacityIcon from '../../svg/experiences/capacity.svg';
import HeartFilled from '../../svg/experiences/heart_filled.svg';
import ShareOutline from '../../svg/experiences/share_outline.svg';
import HeartOutline from '../../svg/experiences/heart_outline.svg';
import LocationOutline from '../../svg/experiences/location_outline.svg';


// import CenteredSharedModal from '../../components/Shared/CenteredSharedModal';
export const BANNER_H = 270;

// import ViewShot from 'react-native-view-shot';
// import {ShareWhatsappModal} from '../../components/Refer';
import {BackIcon, BookIcon, ChevronRightIcon} from '../../svg/Icons';

const EventDetailsScreen = ({route, navigation}: any) => {
  let event = route?.params?.event;
  let redirect_link = event?.redirect_link;

  let info = event?.meta?.important_info?.length
    ? event?.meta?.important_info[0]
    : {};
  let languages = event?.meta?.languages ?? [];
  let about = event?.meta?.aboutHost;

  let headerRef = useRef(null);
  let shareViewRef = useRef(null);


  const aboutRef = useRef(null);
  const descriptionRef = useRef(null);
  const bookTicketErrorRef = useRef(null);

  const scrollA = useRef(new Animated.Value(0)).current;
  const [isExpectationCollapsed, setIsExpectationCollapsed] = useState(true);

  const [infoTitles, setInfoTitles] = useState(Object?.keys(info)?.slice(0, 1));
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const isFloating = !!scrollA;
  const [isTransparent, setTransparent] = useState(isFloating);


  const onExpectationLoadMorePress = () => {
    if (info) {
      setInfoTitles(Object.keys(info));
      setIsExpectationCollapsed(false);
    }
  };

  useEffect(() => {
    if (!scrollA) return;
    const listenerId = scrollA.addListener(a => {
      if (isTransparent !== a.value < BANNER_H) {
        setTransparent(!isTransparent);
        // @ts-ignore
        headerRef?.current?.flipInX(300);
      } else if (a.value == 0) {
        // shareViewRef?.current?.flipInX(300);
      }
    });
    return () => scrollA.removeListener(listenerId);
  });

  const Header = () => {
    return (
      <Box
        pt={16}
        pb={8}
        px={16}
        mx={8}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <BackIcon
          width={28}
          height={28}
          marginRight={10}
          onPress={() => navigation.goBack()}
        />
        {!isTransparent ? (
          <Animatable.View ref={headerRef} style={{flex: 1}}>
            <Text
              fontSize={20}
              lineHeight={24}
              numberOfLines={1}
              variant="semiBold">
              {event.name}
            </Text>
          </Animatable.View>
        ) : (
          <Animatable.View ref={shareViewRef}>
            <Pressable
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'flex-end',
              }}
              onPress={captureAndShareScreenshot}>
              <BookIcon type="shareOutline" width={24} height={24} />
              <Text
                fontSize={16}
                lineHeight={24}
                color="#004AAD"
                textAlign="right"
                numberOfLines={1}
                variant="medium">
                Share
              </Text>
            </Pressable>
          </Animatable.View>
        )}

        {/* <Box flexDirection="row" alignItems="center">
          <Box marginRight={16} onTouchEnd={() => setIsLiked(!isLiked)}>
            {isLiked ? (
              <HeartFilled fill="#F05B5B" height={20} width={20} />
            ) : (
              <HeartOutline height={20} width={20} />
            )}
          </Box>
          <Box onTouchEnd={() => shareRef.current.showShare({})}>
            <ShareOutline height={20} width={20} />
          </Box>
        </Box> */}
      </Box>
    );
  };

  const scheme = Platform.select({ios: 'maps:0,0?q=', android: 'geo:0,0?q='});
  const latLng = `${12.244146},${77.632976}`;
  const label = event?.location?.city;
  const url = Platform.select({
    ios: `${scheme}${label}@${latLng}`,
    android: `${scheme}${latLng}(${label ?? ''})`,
  });

  const AddressContainer = () => {
    return (
      <Box
        mt={8}
        px={32}
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between">
        <Box flex={1} marginRight={16} py={8}>
          <Text variant="medium" color="grey200" fontSize={16}>
            {event?.location?.address ? event?.location?.address + '' : ''}
          </Text>
        </Box>
        {event?.location?.maps_link && (
          <Pressable
            onPress={() => Linking.openURL(event?.location?.maps_link)}>
            <Box
              px={16}
              py={8}
              bg="grey500"
              borderRadius={16}
              flexDirection="row"
              alignItems="center">
              <LocationOutline height={14} width={14} />
              <Text
                mx={2}
                variant="medium"
                letterSpacing={-0.5}
                color="#004AAD"
                fontSize={14}>
                See on Map
              </Text>
              <ChevronRightIcon height={12} width={12} />
            </Box>
          </Pressable>
        )}
      </Box>
    );
  };
  const TimeContainer = () => {
    const isOneDayEvent =
      moment(event?.end_date)
        ?.utcOffset('+05:30')
        ?.format('DD MMM')
        .toString() ==
      moment(event?.start_date)
        ?.utcOffset('+05:30')
        ?.format('DD MMM')
        .toString();
    return (
      <Box
        px={32}
        flex={1}
        marginRight={16}
        flexDirection="row"
        alignItems="center">
        <Text
          fontSize={12}
          color="grey200"
          lineHeight={16}
          variant="regular"
          allowFontScaling={false}>
          {`${moment(event?.start_date)
            ?.utcOffset('+05:30')
            ?.format('DD MMM')} ${
            event?.end_date && !isOneDayEvent
              ? moment(event?.end_date)?.utcOffset('+05:30')?.format('- DD MMM')
              : ''
          }`}
        </Text>
        <Text fontSize={24} lineHeight={28} variant="medium" color="#000000">
          &#x2022;
        </Text>
        <Text variant="medium" style={{color: '#333333'}} fontSize={14}>
          {' '}
          {moment(event?.start_date)
            ?.utcOffset('+05:30')
            ?.format('hh:mm a')}{' '}
          <Text variant="medium" color="grey200" fontSize={14}>
            {event?.duration ? `(${event?.duration})` : ''}
          </Text>
        </Text>
      </Box>
    );
  };

  const Description = () => {
    return (
      <Box px={32} mt={16}>
        {event?.description?.length > 120 ? (
          <>
            <HTML
              // @ts-ignore
              baseFontStyle={{fontFamily: 'Metropolis-Regular'}}
              tagsStyles={tagsStyles}
              source={{
                html: `<span>${
                  event?.description.substring(0, 120) + '...'
                }<span>`,
              }}
            />

            <Text
              lineHeight={20}
              variant="semiBold"
              textDecorationLine="underline"
              // @ts-ignore
              onPress={() => descriptionRef?.current?.showBottom()}>
              Read more
            </Text>
          </>
        ) : (
          <Text variant="regular" color="grey100">
            {event?.description}
          </Text>
        )}
      </Box>
    );
  };

  const Organizer = () => {
    return (
      <Box px={32} mt={8} flexDirection="row" alignItems="center">
        <Box flex={1} mr={16}>
          <Text
            fontSize={18}
            color="grey100"
            lineHeight={20}
            textAlign="left"
            variant="semiBold">
            Hosted by {event?.partner_name}
          </Text>
        </Box>
        {event?.partner_logo && (
          <Box bg="grey300" height={40} width={40} borderRadius={16}>
            <Image
              source={{uri: event?.partner_logo}}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'cover',
              }}
            />
          </Box>
        )}
      </Box>
    );
  };

  const Capacity = () => {
    return (
      <Box px={32} mt={16} flexDirection="row" alignItems="center">
        <CapacityIcon marginRight={4} height={25} width={25} />

        <Text variant="semiBold" color="grey200">
          {' '}
          Event Capacity{' '}
          <Text variant="semiBold" color="grey100">
            {event.max_capacity ?? 0}
          </Text>
        </Text>
      </Box>
    );
  };

  const Languages = () => {
    if (!languages.length) return null;
    if (languages.length == 1)
      return (
        <Box px={32} mt={16} flexDirection="row" alignItems="center">
          <LanguageIcon marginRight={4} height={30} width={30} />
          <Text variant="semiBold" color="grey200">
            {' '}
            Hosted in{' '}
            <Text variant="semiBold" color="grey100" textTransform="capitalize">
              {languages[0]}
            </Text>{' '}
          </Text>
        </Box>
      );
    else
      return (
        <Box px={32} mt={16} flexDirection="row" alignItems="center">
          <LanguageIcon marginRight={4} height={30} width={30} />
          <Text variant="semiBold" color="grey200">
            {' '}
            Hosted in{' '}
            <Text variant="semiBold" color="grey100" textTransform="capitalize">
              {languages.slice(0, -1).join(',')}
            </Text>{' '}
            &{' '}
            <Text variant="semiBold" color="grey100" textTransform="capitalize">
              {languages.slice(-1)}
            </Text>
          </Text>
        </Box>
      );
  };

  const About = () => {
    return (
      <Box px={32} mt={32}>
        {about?.length > 120 ? (
          <>
            <Text variant="regular" numberOfLines={2} color="grey100">
              {about.substring(0, 120)}
            </Text>

            <Text
              lineHeight={20}
              variant="semiBold"
              textDecorationLine="underline"
              // @ts-ignore
              onPress={() => descriptionRef?.current?.showBottom()}>
              Read more
            </Text>
          </>
        ) : (
          <Text variant="regular" color="grey100">
            {about}
          </Text>
        )}
      </Box>
    );
  };

  const UpwardShadow = () => (
    <Box
      top={0}
      alignSelf="center"
      overflow="hidden"
      position="absolute"
      style={{
        height: 50,
        width: '100%',
        overflow: 'hidden',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../assets/experiences/shadow_downward.png')}
        style={{
          width: W * 0.8,
          height: W * 0.1,
          resizeMode: 'cover',
        }}
      />
    </Box>
  );

  const Expectation = () => {
    return (
      <Box px={32} mt={16}>
        <UpwardShadow />
        <Text
          variant="semiBold"
          color="#004AAD"
          fontSize={18}
          lineHeight={24}
          my={16}>
          What to expect
        </Text>
        {/* <Collapsible collapsed={isExpectationCollapsed} collapsedHeight={150}> */}
        {infoTitles?.map(title => {
          return (
            <Box key={title} mb={8}>
              <Text
                fontSize={18}
                color="grey100"
                lineHeight={24}
                variant="semiBold"
                mb={8}>
                {title}
              </Text>
              {info[title].map((bullet: any) => {
                return (
                  <Box key={bullet}>
                    <Box flexDirection="row" alignItems="flex-start">
                      <Box
                        mr={16}
                        mt={8}
                        width={10}
                        height={10}
                        bg="grey300"
                        maxWidth="80%"
                        borderRadius={16}
                      />
                      <Box flex={1}>
                        <Text variant="medium" color="grey200" lineHeight={20}>
                          {bullet}
                        </Text>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          );
        })}
        {/* </Collapsible> */}
        {isExpectationCollapsed ? (
          <Text
            mt={16}
            lineHeight={20}
            variant="semiBold"
            textDecorationLine="underline"
            onPress={onExpectationLoadMorePress}>
            Load more details
          </Text>
        ) : null}
      </Box>
    );
  };
  const BenefitBullets = ({text, image}: any) => {
    return (
      <Box flexDirection="row" alignItems="center" mt={32}>
        <Center height={72} width={80} mr={32} overflow="hidden">
          <Image
            source={image}
            resizeMode="contain"
            style={{width: 72, height: 80}}
          />
        </Center>

        <Box flex={1}>
          <Text variant="medium" color="grey200" lineHeight={20}>
            {text}
          </Text>
        </Box>
      </Box>
    );
  };

  const Benefits = () => {
    return (
      <Box px={32} mt={16}>
        <Text
          my={16}
          fontSize={14}
          lineHeight={24}
          color="primaryRed"
          letterSpacing={1.5}
          variant="semiBold">
          BENEFITS
        </Text>
        <Text variant="semiBold" color="grey100" fontSize={18} lineHeight={24}>
          Why Book with App
        </Text>
        <BenefitBullets
          text="Avail Group Discounts for booking events!"
          image={require('../../assets/experiences/benefit_discount.png')}
        />
        <BenefitBullets
          text="A bill is automatically created and split for the event to pay individual shares"
          image={require('../../assets/experiences/benefit_bill.png')}
        />
        <BenefitBullets
          text="Automatic reminders sent to friends to ensure you get money on time"
          image={require('../../assets/experiences/benefit_reminder.png')}
        />
      </Box>
    );
  };

  const bookTicketHandler = async () => {
    // calendarRef.current.showModal()
    // return null;

    // if (redirect_link) {
    //   Linking.openURL(redirect_link);
    //   return false;
    // }
    setIsButtonLoading(true);
    try {
      // let res = await bookTicket({
      //   data: {
      //     listing_id: event?._id,
      //     start_date: event?.start_date,
      //     end_date: event?.end_date,
      //   },
      // });
      if (true) {
        navigation.navigate('TicketBookingScreen', {
          event,
          booking_id: 'res?.data?.booking_id',
        });
        setIsButtonLoading(false);
      } else {
        setIsButtonLoading(false);
        // @ts-ignore
        bookTicketErrorRef.current.showModal(res?.data?.detail);
      }
    } catch (error) {
      console.log('error', error);
      setIsButtonLoading(false);
      // @ts-ignore
      bookTicketErrorRef.current.showModal(
        !!error ? JSON.stringify(error) : '',
      );
    }
  };

  const captureAndShareScreenshot = () => {
    // captureRef?.current?.capture()?.then(data => {
    //   shareWhatsappRef.current.showShare({
    //     message: `Did you check ${event.name} out on App?`,
    //     // message: `Did you check ${event.name} out on App? [Link]`, // TODO with Link
    //     base64: data,
    //   });
    // });
  };

  return (
    <>
      <Screen pt={40} flex={1} width={W} bg="#ffffff">
        <Header />
        <Animated.ScrollView
          contentContainerStyle={{paddingBottom: 200}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: scrollA}}}],
            {useNativeDriver: true},
          )}
          scrollEventThrottle={16}>
          {/* <ViewShot
            style={{backgroundColor: '#fff'}}
            ref={captureRef}
            options={{
              fileName: 'event-card',
              format: 'jpg',
              quality: 0.9,
              result: 'base64',
            }}> */}
          <Hero event={event} bannerHeight={BANNER_H} />

          <AddressContainer />
          <TimeContainer />
          <Description />
          <Box height={1} mx={32} my={16} bg="grey500" />
          <Organizer />
          <Capacity />
          <Languages />
          {/* </ViewShot> */}
          <About />
          <Expectation />
          {/* <Benefits /> */}
          {/* <DateInputBox
              title={'Due Date'}
              placeholder={'Select date'}
              type={'default'}
              onChangeText={()=>{}}
              value={'date'}
            />

      <DatePickerModal
       ref={calendarRef}
        setDate={()=>{}} 
        // showToast={props.showToast}
        // hideToast={props.hideToast}
      /> */}
        </Animated.ScrollView>

        <ReadMoreBottomSheet ref={descriptionRef}>
          <Box py={16} px={32} style={{paddingBottom: 50}}>
            <HTML
              // @ts-ignore
              baseFontStyle={{fontFamily: 'Metropolis-Regular'}}
              tagsStyles={{
                span: {
                  width: '100%',
                  color: '#3C3C43',
                  lineHeight: 20,
                  marginVertical: 8,
                },
                title: {
                  fontFamily: 'Metropolis-SemiBold',
                },
                bold: {
                  fontFamily: 'Metropolis-SemiBold',
                },
              }}
              source={{html: `<span>${event?.description}<span>`}}
            />
          </Box>
        </ReadMoreBottomSheet>

        <ReadMoreBottomSheet ref={aboutRef}>
          <Box py={16} px={32} style={{paddingBottom: 50}}>
            <HTML
              // @ts-ignore
              baseFontStyle={{fontFamily: 'Metropolis-Regular'}}
              tagsStyles={{
                span: {
                  width: '100%',
                  lineHeight: 20,
                  color: '#3C3C43',
                  marginVertical: 8,
                },
              }}
              source={{html: `<span>${about}<span>`}}
            />
          </Box>
        </ReadMoreBottomSheet>

        <BookTicketBottomSheet
          event={event}
          buttonLoading={isButtonLoading}
          onBookTicketPress={bookTicketHandler}
        />
        <ErrorHandlingModal
          ref={bookTicketErrorRef}
          // @ts-ignore
          description="Something went wrong" onPress={() => bookTicketErrorRef.current.hideModal()}onClose={() => bookTicketErrorRef.current.hideModal()}
        />

        {/* <CenteredSharedModal
          ref={shareRef}
          onOthersShare={() => {}}
          onWhatsappShare={() => {}}
        /> */}
      </Screen>
      {/* <ShareWhatsappModal ref={shareWhatsappRef} /> */}
    </>
  );
};

export default EventDetailsScreen;

const tagsStyles = {
  span: {
    width: '100%',
    color: '#3C3C43',
    lineHeight: 20,
    marginVertical: 8,
  },
  title: {
    fontFamily: 'Metropolis-SemiBold',
  },
  bold: {
    fontFamily: 'Metropolis-SemiBold',
  },
};
