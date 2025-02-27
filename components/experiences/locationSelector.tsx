import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import {View, Modal, StyleSheet, TouchableOpacity, Text} from 'react-native';
// import Location from '../../svg/social/location.svg';
import Location from '../../svg/cities/gurgaon.svg';
import Gurgaon from '../../svg/cities/gurgaon.svg';
import Delhi from '../../svg/cities/delhi.svg';
import Bangalore from '../../svg/cities/bangalore.svg';
import Mumbai from '../../svg/cities/mumbai.svg';
import Chennai from '../../svg/cities/chennai.svg';
import Kolkata from '../../svg/cities/kolkata.svg';
import {Button, COLORS, Flex} from '../../theme';
import {CloseIcon} from '../../svg/Icons';

const cities = ['Delhi', 'Bangalore', 'Mumbai'];

// Function to import SVG dynamically
const importSvg = (name: any) => {
  switch (name) {
    case 'Gurgaon':
      return <Gurgaon height={18} width={18} />;
    case 'Delhi':
      return <Delhi height={18} width={18} />;
    case 'Bangalore':
      return <Bangalore height={18} width={18} />;
    case 'Mumbai':
      return <Mumbai height={18} width={18} />;
    case 'Chennai':
      return <Chennai height={18} width={18} />;
    case 'Kolkata':
      return <Kolkata height={18} width={18} />;
    default:
      return null;
  }
};
const LocationSelector = forwardRef(
  ({setCity, city}: {setCity: any; city: string}, ref) => {
    const [modalVisible, setModalVisible] = useState(false);

    useImperativeHandle(ref, () => ({
      openModal: () => {
        setModalVisible(true);
      },
    }));

    const handleCitySelect = (city: any) => {
      setModalVisible(false);
      setCity(city);
    };

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setModalVisible(true)}>
          {!city ? <Location height={18} width={18} /> : <>{importSvg(city)}</>}
          <Text style={styles.buttonText}>
            {city === '' ? 'Select City' : city}
          </Text>
        </TouchableOpacity>

        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Flex justify="space-between">
                <Text
                  style={{
                    ...styles.cityText,
                    color: COLORS.primary,
                    marginBottom: 10,
                    fontSize: 20,
                  }}>
                  Choose Location
                </Text>
                <CloseIcon onPress={() => setModalVisible(false)} />
              </Flex>
              {cities.map(city => (
                <TouchableOpacity
                  key={city}
                  style={styles.cityItem}
                  onPress={() => handleCitySelect(city)}>
                  {importSvg(city) && (
                    <View style={styles.cityIconContainer}>
                      {importSvg(city)}
                    </View>
                  )}
                  <Text style={styles.cityText}>{city}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: 'gray',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    marginLeft: 5,
    color: 'white',
  },
  locationIcon: {
    marginRight: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cityIconContainer: {
    marginRight: 15,
    marginBottom: 5,
  },
  cityText: {
    fontSize: 18,
    fontFamily: 'Metropolis-Regular',
  },
  selectedCityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LocationSelector;
