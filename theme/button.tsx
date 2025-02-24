import {Pressable, StyleSheet, PressableProps, Image} from 'react-native';
import React, {FC} from 'react';

import {COLORS} from './COLORS';
import {Center, Text, Flex, VStack, PressableBox} from '.';

// SVGs
import {LayoutProps} from './themeTypes';
import {ChevronRightIcon} from '../svg/Icons';
import DottedLoader from './DottedLoader';

// extends two PressableProps and LayoutProps
interface ButtonProps extends LayoutProps, Omit<PressableProps, 'style'> {
  title: string;
  bg?: string;
  icon?: any;
  rightIcon?: any;
  textStyle?: any;
  disabled?: boolean;
  loading?: boolean;
  textColor?: string;
  hasShadow?: boolean;
}
export const Button: FC<ButtonProps> = ({
  title,
  bg = COLORS.primary,
  icon,
  rightIcon,
  textStyle,
  disabled,
  loading,
  hasShadow = true,
  textColor = COLORS.white,
  ...rest
}) => {
  return (
    <PressableBox
      disabled={loading || disabled}
      my={8}
      py={12}
      flexDir="row"
      align="center"
      borderRadius={8}
      justify="center"
      borderColor={disabled ? COLORS.disabledButton : bg}
      bg={disabled ? COLORS.disabledButton : bg}
      flexDirection={'row'}
      w="100%"
      style={hasShadow ? styles.shadow : {}}
      {...rest}>
      {loading ? (
        <Flex w="auto">
          <Text variant="medium16" />
          <DottedLoader />
        </Flex>
      ) : (
        <Flex w="auto">
          {icon ? <Center mr={5}>{icon}</Center> : null}
          <Text
            textAlign="center"
            variant="medium16"
            color={textColor}
            {...textStyle}
            text={title}
          />
        </Flex>
      )}

      <Flex w="auto" position="absolute" right={12}>
        {rightIcon ? <Center ml={5}>{rightIcon}</Center> : null}
      </Flex>
    </PressableBox>
  );
};

interface IconButtonProps extends LayoutProps {
  onPress?: () => void;
  icon?: any;
  isLoading?: boolean;
  color?: string;
  title: string;
  textColor?: string;
}
export const OutlinedButton: FC<IconButtonProps> = ({
  onPress = () => {},
  icon,
  isLoading,
  color = COLORS.primary,
  textColor,
  title,
  ...rest
}) => {
  return (
    <PressableBox
      my={8}
      py={12}
      flexDir="row"
      align="center"
      borderWidth={1}
      borderColor={color}
      borderRadius={8}
      justify="center"
      onPress={() => (isLoading ? {} : onPress())}
      {...rest}>
      <Flex w="auto" justify="center" align="center">
        {isLoading ? (
          <Flex w="auto">
            <DottedLoader color={COLORS.primary} />
          </Flex>
        ) : (
          <Flex w="auto" justify="center">
            {icon ? <Center mr={5}>{icon}</Center> : null}
            <Text
              variant="medium16"
              color={textColor ?? color ?? COLORS.text.primary}>
              {title}
            </Text>
          </Flex>
        )}
      </Flex>
    </PressableBox>
  );
};

export const AccountButton = ({
  onPress,
  icon,
  title,
  subTitle,
  ...rest
}: LayoutProps & {
  onPress: () => void;
  icon: any;
  title: string;
  subTitle?: string;
}) => {
  return (
    <Pressable onPress={onPress}>
      <Flex justify="space-between" my={8} {...rest}>
        <Flex w="auto">
          <Center mr={12} w={48} h={48} bg={COLORS.iconColor} borderRadius={30}>
            {icon}
          </Center>
          <VStack>
            <Text variant="title" fontSize={14}>
              {title}
            </Text>
            {subTitle ? (
              <Text
                variant="description"
                fontSize={12}
                color={COLORS.themeAlpha[60]}>
                {subTitle}
              </Text>
            ) : null}
          </VStack>
        </Flex>
        <Flex w="auto">
          {/* <RightArrow height={20} width={20} color={COLORS.iconColor} /> */}
        </Flex>
      </Flex>
    </Pressable>
  );
};
export const NotificationButton = ({
  onPress,
  icon,
  title,
  isUnread,
  subTitle,
  id,
  ...rest
}: LayoutProps & {
  onPress: (id: string) => void;
  icon: any;
  title: string;
  subTitle?: string;
  isUnread?: boolean;
  id?: string;
}) => {
  return (
    <Pressable onPress={() => onPress(id || '')}>
      <Flex
        width={'100%'}
        justify="space-between"
        alignItems="flex-start"
        bg={isUnread ? 'rgba(9,10,20,0.03)' : 'white'}
        py={8}
        px={8}
        {...rest}>
        <Flex flex={1}>
          <Center mr={12} w={48} h={48} bg={COLORS.iconColor} borderRadius={30}>
            {icon}
          </Center>
          <VStack flex={1}>
            <Text
              variant="title"
              fontSize={14}
              fontWeight={700}
              flex={1}
              flexWrap="wrap">
              {title}
            </Text>
            {subTitle ? (
              <Text
                variant="title"
                fontSize={12}
                fontWeight={700}
                style={{opacity: 0.6}}
                flex={1}
                flexWrap="wrap">
                {subTitle}
              </Text>
            ) : null}
          </VStack>
        </Flex>
        {isUnread ? (
          <VStack backgroundColor="#FF5943" px={12} py={5} borderRadius={20}>
            <Text text="New" color="white" fontSize={12} />
          </VStack>
        ) : null}
      </Flex>
    </Pressable>
  );
};

export const ThemeButton = ({
  onPress = () => {},
  icons,
  title,
  disabled,
  ...rest
}: LayoutProps &
  PressableProps & {
    onPress?: () => void;
    icons?: any;
    title: string;
    disabled?: boolean;
  }) => {
  return (
    <PressableBox
      my={8}
      py={12}
      flexDir="row"
      align="center"
      onPress={() => (disabled ? null : onPress())}
      justify="center"
      borderRadius={30}
      bg={disabled ? COLORS.greyedIcon : 'black'}
      {...rest}>
      {icons ? <Center mr={12}>{icons}</Center> : null}
      <VStack>
        <Text
          variant="title"
          fontSize={16}
          color={COLORS.white}
          fontWeight={700}>
          {title}
        </Text>
      </VStack>
    </PressableBox>
  );
};

interface SocialButtonProps {
  icon: any;
  type: string;
  value: string;
  onPress: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({
  icon,
  type,
  value,
  onPress,
  ...rest
}) => {
  return (
    <Pressable onPress={onPress}>
      <Flex justify="space-between" {...rest}>
        <Flex flexDir="row" w={'auto'}>
          {icon}
          <VStack ml={20}>
            <Text variant="medium16" color={'#191C1F'} fontWeight={400}>
              {type}
            </Text>
            <Text variant="medium16" color={'#004AAD'} fontWeight={400}>
              {value}
            </Text>
          </VStack>
        </Flex>

        <Flex w={'auto'}>
          <ChevronRightIcon />
        </Flex>
      </Flex>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
