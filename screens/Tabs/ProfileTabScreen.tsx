import React, {useState} from 'react';
import {
  Text,
  Screen,
  COLORS,
  Button,
  VStack,
  Flex,
  InputText,
  TextInput,
  ErrorInfoBox,
  Box,
  PressableBox,
  HeaderWithBackButton,
  OutlinedButton,
  Center,
} from '../../theme';

import LinearGradient from 'react-native-linear-gradient';

// import {RightArrow} from '../../svg/Icons';

import {useAppDispatch, useAppSelector} from '../../store/ReduxHook';
import * as yup from 'yup';
import {Formik} from 'formik';
import {Linking} from 'react-native';
import {HomeTabIcon} from '../../svg/tabIcons';

import {login} from '../../store/actions';

const ProfileTabScreen = ({route, navigation}: any) => {
  const dispatch = useAppDispatch();
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);
  const [hasAgreedTerms, setHasAgreedTerms] = useState(false);

  const validationSchema = yup.object().shape({
    username: yup.string().required('Username is required'),
    fullname: yup.string().required('Fullname is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    birthPlace: yup.string(),
    birthDate: yup.string(),
    birthTime: yup.string(),


  });


  const {hasPhoneInput = true, role} = route?.params || {};

  return (
    <Screen>
      <VStack flex={1} >
        <LinearGradient
          start={{x: 0, y: 0.25}}
          end={{x: 0.5, y: 1.0}}
          colors={['#ffffff', '#f8cb6f']}
          style={{height: 160, width: '100%'}}></LinearGradient>
        <VStack px={16}>
          <Formik
            initialValues={{
              username: '',
              fullName: '',
              email: '',
              birthDate: '',
              birthTime: '',
              birthPlace: '',
            }}
            onSubmit={()=>{

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
                <VStack  >
                  <VStack>
                    <Flex mt={-40} gap={8}>
                      <Center >
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
                      <VStack mt={20}><Text variant="regular" color={COLORS.primary} text={values.fullName||'Name'}/>
                    <Text variant="regular"  text={values.email ||'email'}/></VStack></Flex>
                    <TextInput
                      textContentType="emailAddress"
                      autoComplete="email"
                      placeholder="eg: Name"
                      onChangeText={handleChange('username')}
                      onBlur={handleBlur('username')}
                      value={values.username?.toLowerCase()}
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

                    <Flex w='100%' gap={8} >
                    <TextInput
                     
                      containerStyle={{flex:1,}}
                      autoComplete="birthdate-full"
                      placeholder="dd/mm/yyyy"
                      onChangeText={handleChange('birthDate')}
                      onBlur={handleBlur('birthDate')}
                      value={values.birthDate}
                    />
                    <TextInput
                      containerStyle={{flex:1,}}
                      placeholder="hh/mm/ss"
                      onChangeText={handleChange('birthTime')}
                      onBlur={handleBlur('birthTime')}
                      value={values.birthTime}
                    />
                      </Flex>

                      <TextInput
                      placeholder="hh/mm/ss"
                      onChangeText={handleChange('birthPlace')}
                      onBlur={handleBlur('birthPlace')}
                      value={values.birthPlace}
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
