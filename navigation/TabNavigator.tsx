import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {PlatformPressable} from '@react-navigation/elements';
import {TabIcon} from './TabIcons';
import {
  HomeTabScreen,
  RecentTabScreen,
  SearchTabScreen,
  BookingsTabScreen,
  ProfileTabScreen,
} from '../screens/Tabs';
import {Box, Center, COLORS, Text} from '../theme';
import {useLinkBuilder, useTheme} from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function MyTabBar({state, descriptors, navigation}: any) {
  const {colors} = useTheme();
  const {buildHref} = useLinkBuilder();

  return (
    <Box
      flexDirection="row"
      justifyContent="space-between"
      alignItems="center"
      paddingVertical={4}
      backgroundColor="white"
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}>
      {state.routes.map((route: any, index: any) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            key={route.key}
            android_ripple={{color: 'transparent'}}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{flex: 1, width: '100%', height: '100%'}}>
            <Center key={route.name}>
              <TabIcon
                type={route.name}
                color={COLORS.primary}
                height={24}
                width={24}
                focused={isFocused}
              />
              <Text
                variant="medium"
                numberOfLines={1}
                fontSize={10}
                color={isFocused ? COLORS.primary : 'grey'}>
                {label}
              </Text>
            </Center>
          </PlatformPressable>
        );
      })}
    </Box>
  );
}

function TabNavigator() {
  const {buildHref} = useLinkBuilder();
  // const profile = useSelector(state => state?.Profile);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props: any) => <MyTabBar {...props} />}
      screenOptions={({route}) => ({
        lazy: true,
        headerShown: false,
        tabBarShowLabel: false,
      })}>
      <Tab.Screen name="Home" component={HomeTabScreen} />
      <Tab.Screen name="Bookings" component={BookingsTabScreen} />
      <Tab.Screen name="Search" component={SearchTabScreen} />
      <Tab.Screen name="Recent" component={RecentTabScreen} />
      <Tab.Screen name="Profile" component={ProfileTabScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;
