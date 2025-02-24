import React, {useCallback, useImperativeHandle, useMemo, useRef} from 'react';
import {useReducedMotion} from 'react-native-reanimated';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
} from '@gorhom/bottom-sheet';

export type GorhomBottomSheetRef = {
  showBottom: () => void;
  present: () => void;
  hideBottom: () => void;
  dismiss: () => void;
};

const GorhomBottomSheet = React.forwardRef<GorhomBottomSheetRef, any>(
  (
    {
      children,
      snapPoints,
      enableDynamicSizing = true,
      enablePanDownToClose = true,
      hasBackdrop = true, // default true
      onClose = null, // callback on close event
      backdropPressBehavior = 'none', // 'none' , 'close' , ...
      ...rest
    }: any,
    ref
  ) => {
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const reducedMotion = useReducedMotion();

    const snap_Points = useMemo(() => snapPoints, []);

    useImperativeHandle(ref, () => ({
      showBottom: () => bottomSheetRef?.current?.present(),
      present: () => bottomSheetRef?.current?.present(),
      hideBottom: () => bottomSheetRef?.current?.dismiss(),

      dismiss: () => bottomSheetRef?.current?.dismiss(),
    }));

    const handleSheetChanges = useCallback((index: number) => {
      if (index === -1 && onClose) {
        onClose();
      }
    }, []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.6}
          // disappearsOnIndex={-1}
          appearsOnIndex={1}
          pressBehavior={backdropPressBehavior}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        index={1}
        ref={bottomSheetRef}
        handleComponent={null}
        snapPoints={snap_Points}
        onChange={handleSheetChanges}
        animateOnMount={!reducedMotion} // Added to resolve bug in latest android version
        enablePanDownToClose={enablePanDownToClose}
        backdropComponent={hasBackdrop ? renderBackdrop : null}
        {...rest}>
        {children}
      </BottomSheetModal>
    );
  },
);

export default GorhomBottomSheet;
