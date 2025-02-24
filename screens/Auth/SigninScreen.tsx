import React, {useState} from 'react';
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
import {
  EyeCloseIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  RightArrow,
} from '../../svg/Icons';

import {Formik} from 'formik';
import * as yup from 'yup';
import {login} from '../../store/actions';
import {Linking} from 'react-native';
import {useAppSelector} from '../../store/ReduxHook';

const SigninScreen = ({route, navigation}: any) => {
  const dispatch = useDispatch();
  const {loginLoading} = useAppSelector(s => s.auth);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  const validationSchema = yup.object().shape({
    email: yup.string().email('Invalid email'),
    password: yup.string().required('Password is required'),
  });

  const onLogin = (values: {email: string; password: string}) => {
    dispatch(
      login({
        data: {
          email: values.email.toLowerCase(),

          password: values.password,
        },

        callback: cb => {
          // navigation.navigate('HomeScreen', {
          //   email: values.email,
          // });
        },
      }),
    );
  };

  return (
    <Screen pt={40} px={16}>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={values => {
          onLogin(values);
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
                  {'Login now to find whats happening around you'}
                </Text>

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
                  autoFocus={true}
                />
                <TextInput
                  containerStyle={{mt: 20}}
                  leftIcon={
                    <LockIcon height={24} width={24} color={COLORS.primary} />
                  }
                  rightIcon={
                    isPasswordVisible ? (
                      <EyeIcon
                        height={24}
                        width={24}
                        color={COLORS.primary}
                        onPress={() => setIsPasswordVisible(false)}
                      />
                    ) : (
                      <EyeCloseIcon
                        height={24}
                        width={24}
                        color={COLORS.primary}
                        onPress={() => setIsPasswordVisible(true)}
                      />
                    )
                  }
                  textContentType="password"
                  returnKeyType="done"
                  returnKeyLabel="done"
                  secureTextEntry={isPasswordVisible ? false : true}
                  placeholder="Enter Password"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                />
              </VStack>
              <VStack mb={20}>
                <ErrorInfoBox
                  visible={!!errors.email && !!touched.email}
                  message={errors.email}
                />
                <ErrorInfoBox
                  visible={!!errors.email && !!touched.email}
                  message={errors.email}
                />

                <Text mt={16} variant="regular">
                  Login Cred:
                  {'\n'}
                  Email: 'user@example.com'
                  {'\n'}
                  Password: password123
                </Text>
                <Text mt={16} variant="regular">
                  By tapping ‘Log in’ you agree to our{' '}
                  <Text
                    variant="medium"
                    color={COLORS.primary}
                    onPress={() => {
                      Linking.openURL('https://google.com');
                    }}>
                    T&C
                  </Text>
                </Text>

                <Button
                  mt={20}
                  onPress={() => handleSubmit()}
                  title="Log in"
                  loading={loginLoading}
                  rightIcon={<RightArrow color="white" />}
                  disabled={!!errors.email || !!errors.password}
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
