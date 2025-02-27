# EBooking - Development Approach

## 1. State Management
For state management, **Redux Toolkit** is used along with **Redux Saga** for handling side effects like API calls.

### Libraries Used:
- `@reduxjs/toolkit` for state management.
- `react-redux` for connecting Redux with React Native components.
- `redux-saga` for managing async operations.
- `redux-persist` for persisting the Redux store.


## 2. Navigation & Routing
**React Navigation** is used for handling screen transitions with a bottom tab navigator and stack navigation.

### Libraries Used:
- `@react-navigation/native`
- `@react-navigation/stack`
- `@react-navigation/bottom-tabs`

### Example: Stack Navigation
```ts
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "../navigation/TabNavigator";
import EventListingScreen from "../screens/EventDetails";

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="TabNavigator" component={TabNavigator} />
    <Stack.Screen name="EventListingScreen" component={EventListingScreen} />
  </Stack.Navigator>
);

export default MainNavigator;
```

## 3. Styling & Theming
The project follows a **theme-based styling approach** using `StyleSheet` and `react-native-svg` for vector assets.

### Features:
- Light/Dark mode support (can be extended).
- Uses `react-native-svg` for scalable icons.
- Follows a **centralized theme object**.

### Example: Theming
```ts
export const theme = {
  colors: {
    primary: "#4A90E2",
    secondary: "#F5A623",
    background: "#F5F5F5",
    text: "#333",
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
};
```

## 4. Performance Optimizations
Several optimizations are implemented to enhance performance:

### Strategies:
✅ **Memoization with `React.memo`** for optimizing list items.  
✅ **Using `useCallback` and `useMemo`** to prevent unnecessary re-renders.  
✅ **Optimized FlatList** with `keyExtractor`  
✅ **Using MMKV Storage** for fast key-value storage.

### Example: Optimized FlatList
```ts
<FlatList
  data={events}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <EventCard event={item} />}
  getItemLayout={(data, index) => ({
    length: 100, // Fixed item height
    offset: 100 * index,
    index,
  })}
  initialNumToRender={10} // Reduces memory usage
/>
```

---
This document provides an overview of the project's approach to state management, navigation, styling, and performance optimizations.
