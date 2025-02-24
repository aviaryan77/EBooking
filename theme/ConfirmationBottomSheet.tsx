import React, {forwardRef, useRef, useImperativeHandle} from 'react';
import {Text} from './text';
import {COLORS} from './COLORS';
import {Flex, VStack} from './containers';
import {Button, OutlinedButton} from './button';
import GorhomBottomSheet, { GorhomBottomSheetRef } from './GorhomBottomSheet';

export const ConfirmationBottomSheet = forwardRef(
  (
    {
      title,
      titleColor = COLORS.text.primary,
      onClose,
      description,
      onCancelPress,
      confirmLoading, // TO BE HANDLED
      cancelLoading, // TO BE HANDLED
      onConfirmPress = () => {},
      cancelLabel = 'Cancel',
      confirmLabel = 'Yes',
      confirmButtonBg = COLORS.primary,
      onOverlayPress = () => {},
      children,
      snapPoints = ['15%', '20%'],
      ...rest
    }: any,
    ref,
  ) => {
    const bottomSheetRef = useRef<GorhomBottomSheetRef>(null);
    useImperativeHandle(ref, () => ({
      dismiss: () => {
        bottomSheetRef.current?.dismiss();
      },
      present: () => {
        bottomSheetRef.current?.present();
      },
    }));

    const renderContent = () => {
      return (
        <VStack
          flex={1}
          mx={16}
          py={16}
          align="flex-start"
          justify="space-between"
          {...rest}
          >
          <VStack align="flex-start" px={16}>
            {title && (
              <Text
                fontSize={18}
                variant={'title'}
                textAlign="center"
                color={titleColor}
                text={title}
              />
            )}
            {description ? (
              <Text
                my={8}
                textAlign="left"
                variant={'regular'}
                text={description}
              />
            ) : null}
          </VStack>
          <Flex
            bg="white"
            px={16}
            gap={12}
            borderColor="gray.200"
            justify="space-between"
            >
            <OutlinedButton
              flex={1}
              title={cancelLabel}
              isLoading={cancelLoading}
              color={COLORS.disabledButton}
              textColor={COLORS.text.primary}
              onPress={() => {
                cancelLoading === undefined &&  bottomSheetRef.current?.dismiss();
                onCancelPress && onCancelPress();
              }}
            />
            <Button
              flex={1}
              bg={confirmButtonBg}
              title={confirmLabel}
              onPress={() => {
                confirmLoading === undefined && bottomSheetRef.current?.dismiss();
                onConfirmPress();
              }}
            />
          </Flex>
        </VStack>
      );
    };
    return (
      <GorhomBottomSheet
        renderHandle={false}
        ref={bottomSheetRef}
        hasBackdrop={true}
        snapPoints={snapPoints}>
        {children ? children : renderContent}
      </GorhomBottomSheet>
    );
  },
);
