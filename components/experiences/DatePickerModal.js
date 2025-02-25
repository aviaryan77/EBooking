import React, {
  useMemo,
  useState,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';

import { H, Box, Text, BoxPressable } from '../../Constants/Theme';

import moment from 'moment';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { Calendar } from 'react-native-calendars';
import Cross from '../../svg/HomeSetup/cross.svg';
import LeftArrow from '../../svg/HomeSetup/leftArrow.svg';
import isBeforeToday from '../../functions/isBeforeToday';
import RightArrow from '../../svg/HomeSetup/rightArrow.svg';

const DatePickerModal = (props, ref) => {
  const INITIAL_DATE = moment(new Date()).format('YYYY-MM-DD');
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [eventDates, setEventDates] = useState([
    '2023-01-07',
    '2023-01-14',
    '2023-01-21',
    '2023-01-28',
  ]);

  const marked = useMemo(() => {
    let items = {};
    (items[selected] = {
      selected: true,
      disableTouchEvent: true,
      selectedColor: '#5563DA',
      selectedTextColor: 'white',
    }),
      eventDates.map((date) => {
        items[date] = {
          customStyles: {
            container: {
              backgroundColor: 'orange',
            },
            text: {
              color: 'white',
              fontWeight: 'bold',
            },
          },
        };
      });
    return items;
  }, [selected]);

  const onDayPress = useCallback((day) => {
    if (isBeforeToday(new Date(day.dateString))) {
      Toast.show({
        type: 'error',
        text1: "Can't use a past date",
        text2: 'You can only use current or future dates.',
        bottomOffset: 100,
        position: 'bottom',
      });
    } else {
      setSelected(day.dateString);
      props.setDate(moment(day.dateString).format('DD-MM-YYYY'));
      Toast.hide();
    }
    // setModalVisible(false);
  }, []);

  useImperativeHandle(ref, () => ({
    showModal: () => {
      setModalVisible(true);
    },
  }));
  const returnArrow = (direction) => {
    if (direction == 'left') {
      return <LeftArrow height={15} width={15} />;
    } else {
      return <RightArrow />;
    }
  };

  return (
    <Modal
      statusBarTranslucent={true}
      animationIn="zoomIn"
      backdropOpacity={0.4}
      animationInTiming={100}
      isVisible={modalVisible}
      animationOutTiming={200}
      backdropTransitionInTiming={100}
      backdropTransitionOutTiming={200}
      useNativeDriverForBackdrop={true}
      hideModalContentWhileAnimating={true}
      onBackdropPress={() => setModalVisible(false)}
      onBackButtonPress={() => setModalVisible(false)}
    >
      <Box
        style={{
          paddingTop: 20,
          borderRadius: 20,
          height: H / 1.75,
          paddingBottom: 30,
          overflow: 'hidden',
          flexDirection: 'column',
          backgroundColor: 'white',
        }}
      >
        <BoxPressable
          onPress={() => setModalVisible(false)}
          style={{ justifyContent: 'flex-end', flexDirection: 'row' }}
          mb="10"
          px="20"
        >
          <Cross />
        </BoxPressable>
        <Calendar
          markingType={'custom'}
          markedDates={marked}
          hideExtraDays={true}
          current={INITIAL_DATE}
          onDayPress={onDayPress}
          enableSwipeMonths={true}
          style={{ marginBottom: 10 }}
          renderArrow={(direction) => returnArrow(direction)}
        />
      </Box>
    </Modal>
  );
};

export default forwardRef(DatePickerModal);
