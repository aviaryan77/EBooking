import React, {useState, useRef, useImperativeHandle} from 'react';
import {
  View,
  Modal,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
} from 'react-native';

import {Flex, PressableBox, VStack, W} from './containers';

import {COLORS, Text} from '.';

export const ModalBottomPopUp = ({visible, onClose, style, children}: any) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
      visible={visible} // required
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{backgroundColor: 'rgba(0,0,0,.6)', ...style}}>
        {children}
      </KeyboardAvoidingView>
    </Modal>
  );
};

export const ModalPopUp = ({
  style,
  visible,
  onClose,
  children,
  onOverlayPress,
}: {
  style?: any;
  visible: boolean;
  onClose?: () => void;
  children: any;
  onOverlayPress?: () => void;
}) => {
  if (!visible) return null;
  return (
    <Modal
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
      visible={visible} // required
    >
      <TouchableWithoutFeedback onPress={onOverlayPress ?? onClose}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,.6)',
            ...style,
          }}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


export const ConfirmationModal = React.forwardRef(
  (
    {
      title,
      visible,
      onClose,
      description,
      onCancelPress,
      confirmLoading, // TO BE HANDLED
      onConfirmPress,
      cancelLabel = 'No',
      confirmLabel = 'Yes',
      onOverlayPress = () => {},
      ...rest
    }: any,
    ref,
  ) => {
    const [isModalVisible, setIsModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      hideModal: () => {
        setIsModalVisible(false);
      },
      showModal: () => {
        setIsModalVisible(true);
      },
    }));

    return (
      <ModalPopUp
        visible={visible || isModalVisible}
        onOverlayPress={onOverlayPress}
        {...rest}>
        <VStack bg="white" mx={32} pt={16} align="center" borderRadius={16}>
          <VStack align="center" px={16}>
            {title && (
              <Text
                fontSize={18}
                variant={'title'}
                textAlign="center"
                text={title}
              />
            )}
            {description ? (
              <Flex>
                <Text
                  textAlign="center"
                  lineHeight={18}
                  fontSize={12}
                  variant={'description'}
                  text={description}
                />
              </Flex>
            ) : null}
          </VStack>

          <Flex
            mt={12}
            justify="space-around"
            width="100%"
            borderTopWidth={0.5}
            borderColor={COLORS.borderColor}>
            <PressableBox
              py={12}
              w="50%"
              align="center"
              onPress={onConfirmPress}
              borderRightWidth={0.5}
              borderColor={COLORS.borderColor}>
              <Text
                px={12}
                fontSize={15}
                variant={'title'}
                color="red"
                text={confirmLabel}
              />
            </PressableBox>
            <PressableBox
              py={12}
              align="center"
              w="50%"
              onPress={onCancelPress}>
              <Text
                fontSize={15}
                variant={'title'}
                color={COLORS.primaryText}
                text={cancelLabel}
              />
            </PressableBox>
          </Flex>
        </VStack>
      </ModalPopUp>
    );
  },
);

export const FullScreenModal = ({
  style,
  visible,
  onClose,
  children,
}: {
  style?: any;
  visible: boolean;
  onClose: () => void;
  children?: any;
}) => {
  if (!visible) return null;
  return (
    <Modal
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
      // statusBarTranslucent={true}
      visible={visible} // required
    >
      <View
        style={{
          flex: 1,
          backgroundColor: '#ffffff',
          ...style,
        }}>
        {children}
      </View>
    </Modal>
  );
};

export const ErrorHandlingModal = React.forwardRef(
  ({visible, children}: {visible: boolean; children: any}, ref) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [errMessage, setErrMessage] = useState('');

    useImperativeHandle(ref, () => ({
      hideModal: () => {
        setIsModalVisible(false);
      },
      showModal: (err: any) => {
        setIsModalVisible(true);
        setErrMessage(err);
      },
    }));

    return <Modal visible={visible || isModalVisible}>{children}</Modal>;
  },
);
