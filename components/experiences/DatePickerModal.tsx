import React, {
  useMemo,
  useState,
  forwardRef,
  useCallback,
  useImperativeHandle,
} from 'react';

import {H, Box, Text, PressableBox, } from '../../theme';

import moment from 'moment';
import Toast from 'react-native-toast-message';
import {Calendar} from 'react-native-calendars';

import {Modal} from 'react-native';
import { ChevronRightIcon, CloseIcon } from '../../svg/Icons';

const isBeforeToday = (date:any) => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return date < today;
}


const DatePickerModal = (props:any, ref:any) => {
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
    // @ts-ignore
    (items[selected] = {
      selected: true,
      disableTouchEvent: true,
      selectedColor: '#5563DA',
      selectedTextColor: 'white',
    }),
      eventDates.map(date => {
        // @ts-ignore
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

  const onDayPress = useCallback((day:any) => {
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
  const returnArrow = (direction:any )=> {
    if (direction == 'left') {
      return <ChevronRightIcon height={15} width={15} />;
    } else {
      return <ChevronRightIcon />;
    }
  };

  return (
    <Modal statusBarTranslucent={true} visible={modalVisible}>
      <Box
        style={{
          paddingTop: 20,
          borderRadius: 20,
          height: H / 1.75,
          paddingBottom: 30,
          overflow: 'hidden',
          flexDirection: 'column',
          backgroundColor: 'white',
        }}>
        <PressableBox
          onPress={() => setModalVisible(false)}
          style={{justifyContent: 'flex-end', flexDirection: 'row'}}
          mb="10"
          px="20">
          <CloseIcon />
        </PressableBox>
        <Calendar
          markingType={'custom'}
          markedDates={marked}
          hideExtraDays={true}
          current={INITIAL_DATE}
          onDayPress={onDayPress}
          enableSwipeMonths={true}
          style={{marginBottom: 10}}

          renderArrow={direction => returnArrow(direction)}
        />
      </Box>
    </Modal>
  );
};

export default forwardRef(DatePickerModal);
