import React, {useState, useImperativeHandle, useRef} from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';

import {Box, Text, W, H} from '../../theme';
import * as Animatable from 'react-native-animatable';

const ReadMoreBottomSheet = React.forwardRef((props:any, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const animationRef = useRef(null);

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
      // @ts-ignore
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
        <Box pt={16} width={W} bg="#ffffff">
          <Pressable onPressIn={() => hideWithAnimation()}>
            <Box
              mb={16}
              width={30}
              height={5}
              bg="grey200"
              alignSelf={'center'}
              borderRadius={5}
            />
            <Box position="absolute" right={20} top={0}>
              <Text
                variant={'semiBold'}
                color={'#004AAD'}
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
