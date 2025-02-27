# EBooking

## Project Overview
**EBooking** is a cross-platform mobile application built using React Native. It provides an intuitive and seamless experience for booking events.

## Installation & Setup

### Prerequisites
- Node.js (>=18)
- Yarn (preferred) or npm
- React Native CLI
- Android Studio (for Android builds)
- Xcode (for iOS builds)

### Install Dependencies
```sh
yarn install
```

### Running the App
#### Android
```sh
yarn android
```
#### iOS
```sh
cd ios && pod install && cd ..
yarn ios
```

### Start Metro Bundler
```sh
yarn start
```

## Features
- Onboarding flow
- Event listing & details
- Ticket booking
- State management using Redux Toolkit & Redux Saga
- Navigation using React Navigation
- Form validation using Formik & Yup
- Smooth animations with Reanimated & Animatable
- Offline storage with MMKV & Redux-Persist

## Folder Structure
```
EBooking/
│── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # App screens
│   ├── navigation/      # Navigation setup
│   ├── store/           # Redux Saga configurations
│   ├── assets/          # Images, icons
│   ├── helpers/         # Helper functions
│   ├── theme/           # Custom theme
│── App.tsx              # Root component
│── package.json         # Dependencies & scripts
│── README.md            # Project documentation
```

## Dependencies
- **Navigation:** `react-navigation`, `react-native-screens`, `react-native-gesture-handler`
- **State Management:** `@reduxjs/toolkit`, `react-redux`, `redux-saga`, `redux-persist`
- **Forms & Validation:** `formik`, `yup`
- **Animations:** `react-native-reanimated`, `react-native-animatable`
- **Date Handling:** `moment`
- **Storage:** `react-native-mmkv`

## Running Tests
```sh
yarn test
```

## Building for Release
### Android
```sh
cd android && ./gradlew assembleRelease
```
### iOS
```sh
cd ios && xcodebuild -scheme EBooking -sdk iphoneos -configuration Release
```
