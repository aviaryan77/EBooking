import React, {FC} from 'react';
import Toast from 'react-native-toast-message';

import {COLORS} from './COLORS';
import {Flex, VStack, W} from './containers';
import {Text} from './text';

interface ToastProps {
  type?: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message?: string;
}

export const toast = ({type, title, message}: ToastProps) => {
  Toast.show({
    type: type || 'success', // 'success', 'error', 'info', 'warning'
    text1: title,
    text2: message || '',
    position: 'bottom',
    visibilityTime: 3000,
    autoHide: true,
    bottomOffset: 40,
    onShow: () => {},
    onHide: () => {},
  });
};

//toast custom UI
type ToastViewProps = {
  text1?: string;
  text2?: string;
  bg?: string;
  textTitleColor?: string;
  textMessageColor?: string;
  icon?: React.ReactNode;
};
export const ToastViewComponent: FC<ToastViewProps> = ({
  text1,
  text2,
  bg,
  icon,
  textTitleColor = COLORS.text.primary,
  textMessageColor = COLORS.text.primary,
}) => {
  return (
    <VStack bg={bg} width={W * 0.9} px={12} py={12} borderRadius={8}>
      {text1 ? (
        <Text variant="medium" textAlign="left" color={textTitleColor}>
          {text1}
        </Text>
      ) : null}
      {text2 ? (
        <Flex align="flex-start">
          {icon && icon}
          <Flex flex={1}>
            <Text variant="regular" textAlign="left" color={textMessageColor}>
              {text2}
            </Text>
          </Flex>
        </Flex>
      ) : null}
    </VStack>
  );
};

// config for toast
export const toastConfig = {
  success: ({text1, text2}: any) => (
    <ToastViewComponent
      text1={text1}
      text2={text2}
      bg={COLORS.button.green}
      textMessageColor="white"
      textTitleColor="white"
      icon={
        <Flex w="auto" mr={8}>
          <Text variant="medium" color="white">
            ✔
          </Text>
        </Flex>
      }
    />
  ),
  error: ({text1, text2}: any) => (
    <ToastViewComponent
      text1={text1}
      text2={text2}
      bg={COLORS.error}
      textMessageColor="white"
      textTitleColor="white"
      icon={
        <Flex w="auto" mr={8}>
          <Text variant="medium" color="white">
            ✖
          </Text>
        </Flex>
      }
    />
  ),
  info: ({text1, text2}: any) => (
    <ToastViewComponent
      text1={text1}
      text2={text2}
      bg={'#004AADa3'}
      textMessageColor="white"
      textTitleColor="white"
      icon={
        <Flex w="auto" mr={8}>
          <Text variant="medium" color="white">
            ⓘ
          </Text>
        </Flex>
      }
    />
  ),
};
