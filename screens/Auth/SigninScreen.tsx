import React from 'react';
import {
  Text,
  Screen,
  COLORS,
  Button,
  VStack,
  TextInput,
  ErrorInfoBox,
} from '../../theme';

import {useDispatch, useSelector} from 'react-redux';
import {MailIcon, PhoneIcon, RightArrow} from '../../svg/Icons';

import {Formik} from 'formik';
import * as yup from 'yup';
import Log from '../../services/Log';
import {sendOtp, } from '../../store/actions';
import {RootState} from '../../types';
import {Linking} from 'react-native';

const SigninScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {sendOtpLoading, } = useSelector((state: RootState) => state.auth);

  const {hasPhoneInput = true, role} = route?.params || {};

  const validationSchema = yup.object().shape({
    email:  yup.string().email('Invalid email'),
    password:  yup.string().required('Password is required'),
  });

  const onRequestOtp = (values: {
    email: string;
    isPhoneInputVisible: boolean;
    phone: string;
  }) => {
    dispatch(
      sendOtp({
        data: {
          ...(values.isPhoneInputVisible
            ? {
                phone: values.phone,
              }
            : {email: values.email.toLowerCase()}),
        },
        callback: cb => {
          navigation.navigate('OtpScreen', {
            email: values.email,
            phone: values.phone,
            hasPhoneInput: values.isPhoneInputVisible,
            role: role,
          });
        },
      }),
    );
  };

  

  return (
    <Screen pt={40} px={16}>
      <Formik
        initialValues={{
          isPhoneInputVisible: hasPhoneInput,
          email: '',
          phone: '',
        }}
        onSubmit={(values)=>{
           onRequestOtp(values)
        }}
        validationSchema={validationSchema}>
        {({
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          values,
          errors,
          touched,
          setErrors,
          resetForm,
        }) => {
          return (
            <VStack mt={32} flex={1} justify="space-between">
              <VStack>
                <Text variant="header">Sign In</Text>
                <Text mt={8} variant="regular">
                  {values.isPhoneInputVisible
                    ? `Please Enter your 10 digit mobile number`
                    : 'Please Enter your Email address'}
                </Text>
                {values.isPhoneInputVisible ? (
                  <TextInput
                    containerStyle={{mt: 20}}
                    leftIcon={<PhoneIcon />}
                    dataDetectorTypes={['phoneNumber']}
                    textContentType="telephoneNumber"
                    placeholder="Enter Mobile Number "
                    onChangeText={handleChange('phone')}
                    onBlur={handleBlur('phone')}
                    value={values.phone}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    autoFocus={!!values.isPhoneInputVisible}
                    returnKeyType="done"
                    returnKeyLabel="done"
                    onSubmitEditing={() => handleSubmit()}
                  />
                ) : (
                  <TextInput
                    containerStyle={{mt: 20}}
                    leftIcon={<MailIcon />}
                    textContentType="emailAddress"
                    returnKeyType="done"
                    returnKeyLabel="done"
                    autoCapitalize="none"
                    autoComplete="email"
                    placeholder="Enter Email Address"
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email?.toLowerCase()}
                    keyboardType="email-address"
                    inputMode="email"
                    onSubmitEditing={() => handleSubmit()}
                    autoFocus={!values.isPhoneInputVisible}
                  />
                )}

                <Text mt={16} variant="regular">
                  or{' '}
                  <Text
                    variant="medium"
                    color={COLORS.primary}
                    onPress={() => {
                      // setErrors({});
                      resetForm();
                      setFieldValue(
                        'isPhoneInputVisible',
                        !values.isPhoneInputVisible,
                      );
                    }}>
                    {values.isPhoneInputVisible
                      ? `Login via Email`
                      : `Login via Mobile No.`}
                  </Text>
                </Text>
              </VStack>
              <VStack mb={20}>
                <ErrorInfoBox
                  visible={!!errors.email && !!touched.email}
                  message={errors.email}
                />
                <ErrorInfoBox
                  visible={!!errors.phone && !!touched.phone}
                  message={errors.phone}
                />
                <Text mt={16} variant="regular">
                  By tapping ‘Request OTP’ you agree to our{' '}
                  <Text
                    variant="medium"
                    color={COLORS.primary}
                    onPress={() => {
                      Linking.openURL('https://qtopia.in/terms/in-terms');
                    }}>
                    T&C
                  </Text>
                </Text>

                <Button
                  mt={20}
                  onPress={() => handleSubmit()}
                  title="Log in"
                  loading={sendOtpLoading }
                  rightIcon={<RightArrow color="white" />}
                  disabled={!!errors.email || !!errors.phone}
                />
              </VStack>
            </VStack>
          );
        }}
      </Formik>
    </Screen>
  );
};

export default SigninScreen;
