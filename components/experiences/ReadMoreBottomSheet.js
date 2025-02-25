import React, {useState, useImperativeHandle, useRef} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';

import {Box, Text, W, H} from '../../Constants/Theme';
import * as Animatable from 'react-native-animatable';
import {analytics} from '../../configs/analytics';

const ReadMoreBottomSheet = React.forwardRef((props, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const animationRef = useRef();

  useImperativeHandle(ref, () => ({
    hideBottom: () => {
      hideWithAnimation();
    },
    showBottom: () => {
      setIsModalVisible(true);
    },
  }));

  const hideWithAnimation = (duration = 500) => {
    if (animationRef?.current) {
      animationRef.current.fadeOutDownBig(duration);
      setTimeout(() => {
        setIsModalVisible(false);
      }, duration);
    } else setIsModalVisible(false);
  };

  const RenderContent = () => {
    return (
      <Animatable.View
        style={{
          bottom: 0,
          width: '100%',
          overflow: 'hidden',
          alignItems: 'center',
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
        ref={animationRef}
        animation={'fadeInUpBig'}
        duration={500}>
        <Box pt="m" width={W} bg="primaryWhite">
          <Pressable onPressIn={() => hideWithAnimation()}>
            <Box
              mb="m"
              width={30}
              height={5}
              bg="grey200"
              alignSelf={'center'}
              borderRadius={5}
            />
            <Box position="absolute" right={20} top={0}>
              <Text
                variant={'semiBold'}
                color={'primaryBlue'}
                onPress={() => hideWithAnimation()}>
                Close
              </Text>
            </Box>
          </Pressable>
          <ScrollView
            style={{maxHeight: 500}}
            showsVerticalScrollIndicator={false}>
            {props.children}
          </ScrollView>
        </Box>
      </Animatable.View>
    );
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isModalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => hideWithAnimation()}>
        {/* <TouchableWithoutFeedback onPress={() => hideWithAnimation()}> */}
          <Box flex={1} style={{backgroundColor: 'rgba(0,0,0,.1)'}}>
            <RenderContent />
          </Box>
        {/* </TouchableWithoutFeedback> */}
      </Modal>
    </>
  );
});

export default ReadMoreBottomSheet;
