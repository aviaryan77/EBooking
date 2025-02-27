import React, {useState} from 'react';
import {
  Box,
  Flex,
  Text,
  COLORS,
  Screen,
  VStack,
  Center,
  TextInput,
  PressableBox,
} from '../../theme';

import {useAppDispatch, useAppSelector} from '../../store/ReduxHook';
import * as yup from 'yup';
import {Formik} from 'formik';
import {HomeTabIcon} from '../../svg/tabIcons';

const ProfileTabScreen = ({route, navigation}: any) => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.auth);

  const validationSchema = yup.object().shape({
    fullname: yup.string().required('Fullname is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
  });

  return (
    <Screen pt={80}>
      <VStack flex={1}>
        <VStack px={16}>
          <Formik
            initialValues={{
              username: '',
              fullName: user.name,
              email: user?.email || '',
              birthDate: '',
              birthTime: '',
              birthPlace: '',
            }}
            onSubmit={() => {}}
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
                <VStack>
                  <VStack gap={8}>
                    <Flex mt={-40} gap={8}>
                      <Center>
                        <PressableBox
                          onPress={() => {
                            console.log('press');
                          }}>
                          <Box
                            bg={COLORS.primary}
                            borderRadius={100}
                            h={80}
                            w={80}
                            alignItems="center"
                            justifyContent="center">
                            <HomeTabIcon />
                          </Box>
                        </PressableBox>
                      </Center>
                      <VStack mt={20}>
                        <Text
                          variant="semiBold"
                          fontSize={20}
                          color={COLORS.primary}
                          text={values.fullName || 'Name'}
                        />
                        <Text
                          variant="regular"
                          text={values.email || 'email'}
                        />
                      </VStack>
                    </Flex>
                    <TextInput
                      textContentType="emailAddress"
                      autoComplete="email"
                      placeholder="eg: Name"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email?.toLowerCase()}
                      keyboardType="default"
                      onSubmitEditing={() => handleSubmit()}
                    />

                    <TextInput
                      autoComplete="nickname"
                      placeholder="Name"
                      onChangeText={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      value={values.fullName}
                    />
                  </VStack>

                  {/* <Button
                    mt={20}
                    onPress={() => handleSubmit()}
                    title="login"
                    loading={sendOtpLoading}
                    disabled={
                      !!errors.email || !!errors.password || !hasAgreedTerms
                    }
                  /> */}
                </VStack>
              );
            }}
          </Formik>
        </VStack>
      </VStack>
    </Screen>
  );
};

export default ProfileTabScreen;
