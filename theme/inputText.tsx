/* eslint-disable react-native/no-inline-styles */
import {
  Image,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {COLORS} from './COLORS';
import {Flex, Text} from '.';

interface IconParams {
  imgUrl?: string;
  password?: boolean;
  showPassword?: boolean;
}

export const InputText = ({
  label,
  // isValidated,
  showIcon = true,
  IconUrl,
  password,
  placeholder,
  errorMessage,
  // isRequired = false,
  isEditable = true,
  showCountryCode = false,
  onSelectCountry,
  inputContainer,
  ...rest
}: TextInputProps & {
  label?: string;
  isValidated?: boolean;
  showIcon?: boolean;
  IconUrl?: string;
  password?: boolean;
  placeholder?: string;
  errorMessage?: string;
  isRequired?: boolean;
  isEditable?: boolean;
  placeholderTextColor?: string;
  showCountryCode?: boolean;
  onSelectCountry?: any;
  inputContainer?: any;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Flex w="auto" align="center" mb={5}>
            <Text
              text={label}
              fontWeight={400}
              fontSize={12}
              color={COLORS.InputLabelText}
            />

            {/* {isRequired ? (
              <Text
                style={{
                  ...styles.title,
                  color: COLORS.red,
                }}
              />
            ) : null} */}
          </Flex>
          <Flex flex={1} justify="flex-end" pl={12}>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
          </Flex>
        </View>

        <View
          style={[
            styles.inputContainer,
            {
              borderColor: errorMessage
                ? COLORS.borderColor
                : COLORS.borderColor,
              backgroundColor: isEditable
                ? COLORS?.white
                : COLORS?.disabledInput,
            },
            inputContainer,
          ]}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isEditable ? '#fff' : 'rgba(0,0,0,0.01)',
              },
            ]}
            placeholder={placeholder}
            secureTextEntry={!showPassword && password}
            placeholderTextColor={COLORS.placeHolderText}
            editable={isEditable}
            {...rest}
          />
          {showIcon ? (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              disabled={!password}
              style={styles.iconContainer}></TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },

  errorMessage: {
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: '400',
    color: '#FF3A29',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 10,
    backgroundColor: '#FFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    color: COLORS.primaryText,
    paddingVertical: 8,
  },
  iconContainer: {
    marginLeft: 10,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
