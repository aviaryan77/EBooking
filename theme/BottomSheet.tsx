import React, { useState, useImperativeHandle, ReactNode } from 'react';
import { Modal, View, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';

interface BottomSheetProps {
  children: ReactNode;
}

const BottomSheet = React.forwardRef(({ children }: BottomSheetProps, ref) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    hideBottom: () => {
      hideWithAnimation();
    },
    showBottom: () => {
      setIsModalVisible(true);
    },
  }));

  const hideWithAnimation = (duration = 100) => {
    setIsModalVisible(false);
  };

  const onClose = () => {
    setIsModalVisible(false);
  };

  const RenderContent = () => {
    return (
      <View
        style={{
          bottom: 0,
          width: '100%',
          overflow: 'hidden',
          alignItems: 'center',
          position: 'absolute',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        {children}
      </View>
    );
  };

  return (
    <>
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        statusBarTranslucent={true}
        onRequestClose={() => hideWithAnimation()}
      >
        <TouchableWithoutFeedback onPress={() => hideWithAnimation()}>
          <View style={{ backgroundColor: 'rgba(0,0,0,.1)', flex: 1 }}>
            <RenderContent />
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
});

export default React.memo(BottomSheet);


// import React, {useState, useImperativeHandle} from 'react';
// import {Modal, View, TouchableWithoutFeedback} from 'react-native';

// const BottomSheet = React.forwardRef(({children}, ref) => {
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   useImperativeHandle(ref, () => ({
//     hideBottom: () => {
//       hideWithAnimation();
//     },
//     showBottom: () => {
//       setIsModalVisible(true);
//     },
//   }));
//   const hideWithAnimation = (duration = 100) => {
//     setIsModalVisible(false);
//   };

//   const onClose = () => {
//     setIsModalVisible(false);
//   };

//   const RenderContent = () => {
//     return (
//       <View
//         style={{
//           bottom: 0,
//           width: '100%',
//           overflow: 'hidden',
//           alignItems: 'center',
//           position: 'absolute',
//           borderTopLeftRadius: 20,
//           borderTopRightRadius: 20,
//         }}>
//         {children}
//       </View>
//     );
//   };

//   return (
//     <>
//       <Modal
//         transparent={true}
//         animationType="slide"
//         visible={isModalVisible}
//         statusBarTranslucent={true}
//         onRequestClose={() => hideWithAnimation()}>
//         <TouchableWithoutFeedback onPress={() => hideWithAnimation()}>
//           <View style={{backgroundColor: 'rgba(0,0,0,.1)', flex: 1}}>
//           <RenderContent />
//           </View>
//         </TouchableWithoutFeedback>
        
//       </Modal>
//     </>
//   );
// });

// export default React.memo(BottomSheet);
