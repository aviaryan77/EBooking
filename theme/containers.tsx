import React, {FC} from 'react';
import {
  View,
  TextStyle,
  StatusBar,
  Pressable,
  Dimensions,
  SafeAreaView,
  PressableProps,
  ActivityIndicator,
} from 'react-native';
import {Button, COLORS, Text} from '.';
import DottedLoader from './DottedLoader';

export const H = Dimensions.get('window').height;
export const W = Dimensions.get('window').width;

import {FlexProps, LayoutProps} from './themeTypes';
import {useNavigation} from '@react-navigation/native';
import {BackIcon, CloseIcon, InfoIcon, } from '../svg/Icons';
import { goBack, navigate, navigationRef } from '../navigation/RootNavigation';


const getLayoutShort = (args: LayoutProps) => {
  return {
    width: args?.w ?? args?.width,
    height: args?.h ?? args?.height,
    margin: args?.m ?? args?.margin,
    padding: args?.p ?? args?.padding,
    paddingTop: args?.pt ?? args?.paddingTop,
    paddingLeft: args?.pl ?? args?.paddingLeft,
    paddingRight: args?.pr ?? args?.paddingRight,
    paddingBottom: args?.pb ?? args?.paddingBottom,
    paddingVertical: args?.py ?? args?.paddingVertical,
    paddingHorizontal: args?.px ?? args?.paddingHorizontal,
    marginTop: args?.mt ?? args?.marginTop,
    marginLeft: args?.ml ?? args?.marginLeft,
    marginRight: args?.mr ?? args?.marginRight,
    marginBottom: args?.mb ?? args?.marginBottom,
    marginVertical: args?.my ?? args?.marginVertical,
    marginHorizontal: args?.mx ?? args?.marginHorizontal,
    backgroundColor: args?.bg ?? args?.backgroundColor,
    flexDirection: args?.flexDir ?? args?.flexDirection,
    justifyContent: args?.justify ?? args?.justifyContent,
    alignItems: args?.align ?? args?.alignItems,
    border: args?.border ?? args?.borderWidth,
    alignSelf: args?.alignSelf ?? args?.alignSelf,
    borderRadius: args?.rounded ?? args?.borderRadius,
    flexGrow: args?.flexGrow ?? args?.flexGrow,
    gap: args?.gap ?? args?.gap,
    // add more shorthand here
    ...args?.style,
    ...args,
  };
};

const TransparentStatusBar = ({barStyle, bgColor, ...rest}: any) => (
  <StatusBar
    translucent
    barStyle={barStyle ?? 'dark-content'}
    backgroundColor={bgColor ?? 'transparent'}
    {...rest}
  />
);

export const Screen = ({
  children,
  // w = W,
  translucent = true,
  bg = COLORS.white,
  bgColor = 'transparent',
  barStyle = 'dark-content', // 'dark-content', 'light-content', 'default'
  ...rest
}: any) => {
  return (
    <View style={{...getLayoutShort({flex: 1, bg, ...rest})}}>
      <TransparentStatusBar
        translucent={translucent}
        barStyle={barStyle}
        bgColor={bgColor}
      />
      <SafeAreaView style={{flex: 1}}>{children}</SafeAreaView>
    </View>
  );
};

export const Flex: React.FC<
  FlexProps & LayoutProps & {children?: React.ReactNode}
> = ({children, w = '100%', align = 'center', flexDir = 'row', ...args}) => {
  return (
    <View
      style={{
        ...getLayoutShort({align, flexDir, w, ...args}),
      }}>
      {children}
    </View>
  );
};

export const Center = ({
  align = 'center',
  justify = 'center',
  children,
  ...args
}: any) => {
  return (
    <View style={{...getLayoutShort({align, justify, ...args})}}>
      {children}
    </View>
  );
};

export const Box = ({children, ...args}: any) => {
  return (
    <Pressable style={{...getLayoutShort({...args})}}>{children}</Pressable>
  );
};

export const VStack = ({children, ...args}: any) => {
  return <View style={{...getLayoutShort({...args})}}>{children}</View>;
};

export const PressableBox: React.FC<
  PressableProps & LayoutProps & {children: React.ReactNode}
> = ({children, onPress = () => {}, ...args}: any) => {
  return (
    <Pressable
      hitSlop={10}
      onPress={onPress}
      style={{...getLayoutShort({...args})}}>
      {children}
    </Pressable>
  );
};

interface HeaderProps extends LayoutProps {
  title?: string;
  leftComponent?: any;
  rightComponent?: any;
}
export const HeaderWithBackButton: FC<HeaderProps> = ({
  title = '',
  leftComponent = (
    <Flex w="auto" my={2} marginRight={16}>
      <Pressable
        hitSlop={8}
        onPress={() => {
          if (navigationRef.current?.canGoBack()) {
            goBack();
          } else {
            navigate('ProfileScreen');
          }
        }}>
        <BackIcon
          height={34}
          width={34}
          onPress={() => {
            if (navigationRef.current?.canGoBack()) {
              goBack();
            } else {
              navigate('LoginScreen');
            }
          }}
          color={COLORS.iconColor}
        />
      </Pressable>
    </Flex>
  ),
  rightComponent,
  ...rest
}: {
  title?: string;
  leftComponent?: any;
  rightComponent?: any;
}) => {
  return (
    <Flex justify="space-between" align="center" {...rest}>
      <Flex w="auto">
        {leftComponent}
        <Flex w="auto" bg={'white'}>
          {title ? <Text variant="title">{title}</Text> : null}
        </Flex>
      </Flex>
      <Flex w="auto">{rightComponent ? rightComponent : <Flex w={24} />}</Flex>
    </Flex>
  );
};

export const CancellableHeader = ({
  title,
  leftButtonLabel = 'Cancel',
  rightButtonLabel = 'Save',
  onLeftButtonPress,
  onRightButtonPress = () => {},
  rightButtonColor = '#2B303A',
  isRightButtonLoading = false,
  showRightButton = true,
  isRightButtonDisabled = false,
  ...rest
}: {
  title?: string;
  leftButtonLabel?: string;
  rightButtonLabel?: string;
  onLeftButtonPress?: () => void;
  onRightButtonPress?: () => void;
  rightButtonColor?: any;
  showRightButton?: boolean;
  isRightButtonLoading?: boolean;
  isRightButtonDisabled?: boolean;
  [key: string]: any;
}) => {
  return (
    <HeaderWithBackButton
      title={title}
      leftComponent={
        <PressableBox
          w="auto"
          onPress={() => (onLeftButtonPress ? onLeftButtonPress() : goBack())}>
          <Text
            variant="regular"
            fontSize={16}
            color={COLORS.error}
            text={leftButtonLabel}
          />
        </PressableBox>
      }
      rightComponent={
        showRightButton ? (
          <>
            {isRightButtonLoading ? (
              <DottedLoader />
            ) : (
              <PressableBox
                onPress={() =>
                  isRightButtonDisabled ? null : onRightButtonPress()
                }>
                <Text
                  variant="semiBold"
                  fontSize={17}
                  text={rightButtonLabel}
                  color={isRightButtonDisabled ? 'lightgray' : rightButtonColor}
                />
              </PressableBox>
            )}
          </>
        ) : null
      }
      {...rest}
    />
  );
};

export const AuthContainer = ({
  children,
  bg = 'white',
  px = 20,
  onPress,
  linkText,
  text,
  title,
  StepPercent,
  ...rest
}: any) => {
  return (
    <View
      style={{
        ...getLayoutShort({flex: 1, px, bg, ...rest}),
      }}>
      <SafeAreaView style={{flex: 1, paddingBottom: 0}}>
        <VStack alignItems="center">
          <Text text={title} fontWeight={600} fontSize={24} />

          <Flex backgroundColor={COLORS.statusBarBGColor} my={30}>
            <Flex
              backgroundColor={COLORS.primary}
              height={4}
              width={StepPercent}
            />
          </Flex>
        </VStack>

        {children}
      </SafeAreaView>
    </View>
  );
};

export const BackNavigation: React.FC<
  LayoutProps & {
    text?: string;
    onBackPress?: any;
    textColor?: string;
    arrowColor?: string;
  }
> = ({text = 'Back', onBackPress, arrowColor, textColor, ...rest}: any) => {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();
  return canGoBack ? (
    <PressableBox
      flexDir="row"
      align="center"
      onPress={() => {
        onBackPress ? onBackPress() : navigation.goBack();
      }}
      {...rest}>
      {/* <ArrowLeft
				marginRight={10}
				height={16}
				width={16}
				color={arrowColor}
			/> */}
      <Text fontWeight={500} fontSize={14} color={textColor}>
        {text}
      </Text>
    </PressableBox>
  ) : (
    <></>
  );
};

export const InputCard: React.FC<
  LayoutProps & {
    title?: string;
    children?: React.ReactNode;
    titleStyle?: TextStyle;
  }
> = ({children, titleStyle, title, ...rest}: any) => {
  return (
    <VStack
      p={20}
      my={8}
      bg={COLORS.white}
      borderRadius={6}
      elevation={2}
      {...rest}>
      {title ? (
        <Text variant="bold" fontSize={14} {...titleStyle}>
          {title}
        </Text>
      ) : null}
      {children}
    </VStack>
  );
};

// Component if we don't have data for any list
export const EmptyComponent = ({
  title = '',
  buttonText = '',
  Icon,
  buttonIcon,
  hasNewButton,
  onPress,
  ...rest
}: {
  title?: string;
  buttonText?: string;
  Icon?: any;
  buttonIcon?: any;
  hasNewButton?: boolean;
  onPress?: any;
} & LayoutProps) => {
  return (
    <VStack
      justifyContent="center"
      alignItems="center"
      flexGrow={1}
      gap={5}
      {...rest}>
      {Icon ? Icon : null}
      <Text text={title} fontWeight="500" fontSize={14} />
      {hasNewButton ? (
        <Button title={buttonText} icon={buttonIcon} onPress={onPress} />
      ) : null}
    </VStack>
  );
};

// Component for data fetching
export const Loader = ({
  h = '100%',
  title = 'loading...',
  buttonText = '',
  buttonIcon,
  onPress,
  ...rest
}: any) => {
  return (
    <VStack h={h} alignItems="center" justifyContent="center" {...rest}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text
        text={title}
        fontWeight="500"
        fontSize={14}
        color={COLORS.primary}
      />
    </VStack>
  );
};

interface ErrorInfoBoxProps {
  visible: boolean;
  message?: string;
}
export const ErrorInfoBox: React.FC<ErrorInfoBoxProps> = ({
  visible,
  message,
}) => {
  if (!visible) return null;
  return (
    <Flex borderRadius={4} bg={COLORS.error} py={8} gap={8} px={12}>
      <InfoIcon color="white" />

      <Text variant="regular" color={COLORS.white}>
        {message}
      </Text>
    </Flex>
  );
};

interface FlexStatsProps extends LayoutProps {
  type: string;
  value: any;
  visible?: boolean | number;
}

export const FlexStats: React.FC<FlexStatsProps> = ({
  visible = true,
  type,
  value,
  ...rest
}) => {
  if (!visible) return null;
  return (
    <Flex
      px={16}
      py={12}
      borderBottomWidth={0.5}
      align="flex-start"
      borderBottomColor={COLORS.border.disabled}
      {...rest}>
      <Flex flex={1} w={'auto'}>
        <Text variant="regular16" color={'#5E6163'} text={type} />
      </Flex>
      <Flex flex={1} w={'auto'}>
        <Text ml={4} variant="medium16" text={value} />
      </Flex>
    </Flex>
  );
};

interface ScoreboardStatsProps extends LayoutProps {
  name: string;
  score: string;
}
export const ScoreboardStats: React.FC<ScoreboardStatsProps> = ({
  name,
  score,
  ...rest
}) => {
  return (
    <Flex
      px={16}
      py={16}
      borderBottomWidth={0.5}
      // align="flex-start"
      justify="space-between"
      borderBottomColor={COLORS.border.disabled}
      {...rest}>
      <Flex flex={1} w={'auto'} borderWidth={2}>
        <Flex w={'auto'} align={'center'}>
          <Text variant="regular16" color={'#5E6163'} text={'rank'} />
        </Flex>
        <Flex flex={1} w={'auto'} align={'center'}>
          <Text ml={16} variant="regular16" color={'#5E6163'} text={name} />
        </Flex>
      </Flex>
      <Flex w={'auto'}>
        <Text ml={4} variant="medium16" text={score} />
      </Flex>
    </Flex>
  );
};

interface BlockStatsProps extends LayoutProps {
  visible?: boolean;
  type: string;
  value?: string | number;
  icon?: any;
}
export const BlockStats: React.FC<BlockStatsProps> = ({
  visible = true,
  type,
  value,
  icon,
  ...rest
}) => {
  if (!visible) return null;
  return (
    <VStack mt={16} align="center" {...rest}>
      <Text variant="regular16" text={type} />

      <Flex mt={12} justify="center" align={'center'}>
        {icon ? icon : null}
        <Text variant="bold" fontSize={30} text={value} />
      </Flex>
    </VStack>
  );
};

interface StatsContainerProps extends LayoutProps {
  header: string;
  onCrossPress?: () => void;
}
export const HeaderWithCrossButton: FC<StatsContainerProps> = ({
  header,
  onCrossPress,
  ...rest
}) => {
  return (
    <Flex px={16} mb={8} align="center" justify="space-between" {...rest}>
      <Flex w="auto">
        <Text ml={4} variant="heading2" text={header} />
      </Flex>

      <Flex w="auto">
        <CloseIcon
          onPress={() => {
            onCrossPress ? onCrossPress() : goBack();
          }}
        />
      </Flex>
    </Flex>
  );
};
