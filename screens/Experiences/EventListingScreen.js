import React, {useState, useEffect, useRef} from 'react';
import {ScrollView, FlatList, RefreshControl,Pressable} from 'react-native';
import Image from 'react-native-scalable-image';

import moment from 'moment';
import {CrossLight} from '../../assets/Icons';
import {Flex, Screen} from '../../components/Restyle';
import {Box, Text, W} from '../../Constants/Theme';
import {currencyFormat} from '../../helperFunctions/eventHelper';

import getRemoteValues from '../../functions/getRemoteValues';
import {getAllExperiences} from '../../helperFunctions/Api';
import EventActions from '../../components/experiences/EventsActions/EventAction';
import {analytics} from '../../configs/analytics';
import Log from '../../helperFunctions/Log';
import { AuthContext } from '../../contexts/authContext';
import LocationSelector from '../../components/experiences/locationSelector';
import firestore from '@react-native-firebase/firestore';
import { userCurrency } from '../../helperFunctions/currencies';

const category = [
  'all',
  'events',
  'music',
  'LifeStyle',
  'Active',
  'Sports',
  'Expo',
];

const EventListingScreen = ({route, navigation}) => {
  const [experienceList, setExperienceList] = useState([]);

  useEffect(()=>{
    if(route?.params?.experienceList)
    {
    }else{
      getEvents();
    }
   
  },[])
  const [city,setCity]=useState(route?.params?.city?route?.params?.city:"");
  const locationSelectorRef = useRef(null);

  const openLocationModal = () => {
    locationSelectorRef.current.openModal();
  };

  useEffect(()=>{
    if(city=="")
    {
      openLocationModal()
    }
  },[city])
  const getEvents = async () => {
    try {
      const collectionRef = firestore().collection('events');
      const querySnapshot = await collectionRef.where("location.city", "==", city).get();

     
      var eventsData = [];
      querySnapshot.forEach(async(doc) => {
        const eventData = doc.data();
        const eventId = doc.id;

        // Fetch stats object from eventStats collection
       
        const eventStatsRef = firestore().collection('eventStats').doc(eventId);
        eventStatsRef.get().then((snapshot) => {
          const statsData = snapshot.data();
        
          // Add stats object to events data
          eventData.stats = statsData;

          // Add eventId to events data
          eventData.id = eventId;

         eventsData.push(eventData);
          if(eventsData.length==querySnapshot.docs.length)
          {
            setExperienceList(eventsData);
          }
         
        });
        
      
      });
    
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  const updateExperienceListing = (eventId, views, like, comments,likesByUser) => {
    setExperienceList(prevList => {
      // Create a copy of the previous experience list
      const updatedList = [...prevList];
  
      // Find the index of the experience with the matching eventId
      const experienceIndex = updatedList.findIndex(experience => experience.id === eventId);
  
      // If the experience is found in the list
      if (experienceIndex !== -1) {
        // Create a copy of the stats object
        const updatedStats = { ...updatedList[experienceIndex].stats };
  
        // Update the stats object with the provided views, like, and comments if they are provided
        if (views !== null) {
          updatedStats.views = views;
        }
    
       
        if (like !== null) {
          updatedStats.like = like;
        }else{
          updatedStats.like = 0;
        }

        if(likesByUser!==null)
        {
          updatedStats.likesByUser=likesByUser;
        }
    
        if (comments !== null) {
          updatedStats.comments = comments;
        }
  
        // Update the stats object in the experience list
        updatedList[experienceIndex].stats = updatedStats;
      }
  
      // Return the updated experience list
      return updatedList;
    });
  };

 
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredExperienceList, setFilteredExperienceList] =
    useState(experienceList);

    const { state } = React.useContext(AuthContext);
    const userData = JSON.parse(state.userData);
    const userId = userData && userData.user_id;

  const onCategoryPress = item => {
    if (item === 'all') {
      setFilteredExperienceList(experienceList);
    } else {
      setFilteredExperienceList(
        experienceList.filter(
          event => event?.type?.toLowerCase() == item.toLowerCase(),
        ),
      );
    }
    setSelectedCategory(item?.toLowerCase());
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    if(city!='')
    {
      getExperiences(city);  
    }
   
    // wait(1000).then(() => setRefreshing(false));
  }, [city]);

  
  useEffect(()=>{
if(city!="")
{
  setRefreshing(true);
  getExperiences(city); 
}
 

   
  },[city])

  const getExperiences = async (city) => {
    try {

      const collectionRef = firestore().collection('events');
      const querySnapshot = await collectionRef.where("location.city", "==", city).get();
    

      if(querySnapshot.docs.length==0)
      {
      
         setFilteredExperienceList([]);
          setRefreshing(false);
          return false;
      }
     
      var eventsData = [];
      querySnapshot.forEach(async(doc) => {
        const eventData = doc.data();
        const eventId = doc.id;

  
       
        const eventStatsRef = firestore().collection('eventStats').doc(eventId);
        eventStatsRef.get().then((snapshot) => {
          const statsData = snapshot.data();
        
          // Add stats object to events data
          eventData.stats = statsData;

          // Add eventId to events data
          eventData.id = eventId;

         eventsData.push(eventData);
      
        
          if(eventsData.length==querySnapshot.docs.length)
          {
            
            setFilteredExperienceList(eventsData);
            setRefreshing(false);
          }
         
        }).catch(err=>console.log(err));
        
      
      });
    
    } catch (error) {
      console.log('Error getting documents: ', error);
    }
  };

  const openCommentInside=(item)=>{
    navigation.navigate('EventDetailsScreen', {event: item,updateExperienceListing:route?.params?.updateExperienceListing,openComment:true});
  }

  const event_home_message_1 = getRemoteValues(
    'event_home_message_1',
  ).asString();
  const event_home_message_2 = getRemoteValues(
    'event_home_message_2',
  ).asString();

  const renderCategory = ({item, index}) => {
    let selected = selectedCategory?.toLowerCase() === item?.toLowerCase();
    return (
      <Pressable onPress={() => onCategoryPress(item)}>
        <Box
          px="m"
          py="s"
          mr="s"
          my="m"
          height={36}
          borderWidth={1}
          borderRadius="m"
          alignItems="center"
          justifyContent="center"
          borderColor="primaryBlue"
          bg={selected ? 'primaryBlue' : 'primaryWhite'}>
          <Text
            fontSize={14}
            lineHeight={16}
            textTransform="capitalize"
            variant={selected ? 'semiBold' : 'medium'}
            color={selected ? 'primaryWhite' : 'primaryBlue'}>
            {item}
          </Text>
        </Box>
      </Pressable>
    );
  };

  const renderEventCard = ({item, index}) => {
    let event = item;
    const isOneDayEvent =
      moment(event?.end_date)?.utcOffset('+05:30')?.format('DD MMM').toString() ==
      moment(event?.start_date)?.utcOffset('+05:30')?.format('DD MMM').toString();
    return (<>
      <Pressable
        onPress={() => {
          navigation.navigate('EventDetailsScreen', {event: item,updateExperienceListing:route?.params?.updateExperienceListing});
          analytics.track('Discovery Page Event Click', {name: item.name});
        }}>
        <Box py="s" px="m" mt="m">
          <Box py="m" flexDirection="row" justifyContent="center">
            <Box width={120} justifyContent="center">
              <Box borderRadius={12} overflow="hidden">
                <Image
                  width={120}
                  source={{
                    uri: !!event?.gallery[0]?.thumbnail
                      ? event?.gallery[0]?.thumbnail
                      : !!event?.gallery[0]?.url
                      ? event?.gallery[0]?.url
                      : 'https://firebasestorage.googleapis.com/v0/b/splitkaro-web.appspot.com/o/SplitkaroLogo.png?alt=media&token=ef424815-59c1-45bf-936a-33e4ee1045ec',
                  }}
                />
              </Box>
            </Box>
            <Box px="m" flex={1} height="auto" justifyContent="space-between">
              <Box>
                <Box
                  px="s"
                  mb="s"
                  bg="yellow"
                  borderRadius={4}
                  alignSelf="flex-start"
                  alignItems="flex-start">
                  <Text
                    variant="regular"
                    color="primaryWhite"
                    lineHeight={20}
                    textTransform="capitalize">
                    {event?.type}
                  </Text>
                </Box>

                <Text variant="semiBold" fontSize={16} lineHeight={20}>
                  {event?.name}
                </Text>
                <Text
                  variant="regular"
                  color="grey200"
                  fontSize={14}
                  lineHeight={20}>
                  {event?.location?.address ?? event?.location?.city}
                </Text>
                <Box style={{flexDirection:"row"}}>
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
                  ? moment(event?.end_date)
                      ?.utcOffset('+05:30')
                      ?.format('- DD MMM')
                  : ''
              }`}
            </Text><Text> &#10022; {event?.duration}</Text></Box>
              </Box>

              <Box>
                {/* <Text
                variant="medium"
                fontSize={12}
                lineHeight={14}
                color="primaryRed"
                mt="m">
                Only {item?.inventory} tickets remaining
              </Text> */}
                <Text mt="s" fontSize={16} variant="semiBold">
                {userCurrency(userData)}{currencyFormat(item?.price)}{' '}
                  <Text fontSize={14} variant="regular">
                    per person
                  </Text>
                </Text>
              </Box>
            </Box>
          </Box>
          {item?.flash_sale_text.length>0&&(
          <Box
            px="m"
            py="s"
            width="100%"
            bg="green100"
            borderRadius="s"
            justifyContent="center">
            <Text variant="medium" fontSize={12} color="green500">
              {item?.flash_sale_text}
            </Text>
          </Box>)}
        
        </Box>
      </Pressable>
      <Box marginTop={"m"}>

            <EventActions commentCount={item?.stats?.comments?.length>0?item?.stats?.comments?.length:0}  likedByYou={item?.stats?.likesByUser?.includes(userId)?true:false} listingPage={true} openCommentInside={()=>{openCommentInside(item)}} updateData={route?.params?.updateExperienceListing?route?.params?.updateExperienceListing:updateExperienceListing} viewCount={item?.stats?.views ? item?.stats?.views:0} likeCount={item?.stats?.like? item?.stats?.like:0} eventId={item._id} userId={userId}></EventActions>
          </Box>
      </>
    );
  };

  const renderEmptyComponent = () => (
    <Box alignItems="center" mt="l">
      <Text fontSize={14} lineHeight={16} variant="medium" color="primaryBlue">
        More events coming soon!
      </Text>
    </Box>
  );

  //_________________main return________________//
  return (
    <Screen flex={1} width={W} bg="primaryBlue">
     
      <Box flex={1}>
        <Box width={'100%'} top={0} mt="l" px="l" mb="l">
          <Flex justify="space-between">
            <CrossLight
              width={30}
              height={30}
              onPress={() => navigation.goBack()}
            />
               <Box > 
        <LocationSelector ref={locationSelectorRef} setCity={setCity}/>
        </Box>
          </Flex>

          <Text
            fontSize={20}
            lineHeight={24}
            variant="semiBold"
            paddingVertical={'s'}
            color={'primaryWhite'}>
           {event_home_message_1}
          </Text>
          <Text
            opacity={0.75}
            variant="regular"
            letterSpacing={-0.3}
            color={'primaryWhite'}
            style={{maxWidth: '90%'}}>
           {event_home_message_2}
          </Text>
        </Box>

     
       
       
        <Box
          width={W}
          borderRadius={24}
          bg="primaryWhite"
          minHeight={700}>
          {/* <FlatList
            horizontal
            data={category}
            keyExtractor={item => item}
            renderItem={renderCategory}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{paddingLeft: 16}}
          /> */}

          <FlatList
            data={filteredExperienceList}
            renderItem={renderEventCard}
            keyExtractor={item => item?._id}
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={{paddingBottom: 400}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        </Box>
      </Box>
    </Screen>
  );
};

export default EventListingScreen;
