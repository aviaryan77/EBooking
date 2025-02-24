// @ts-nocheck

import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Flex,
  Input,
  Button,
  VStack,
  FormLabel,
  InputGroup,
  FormControl,
  InputLeftElement,
  useColorModeValue,
  InputRightElement,
} from '@chakra-ui/react';
import { EmailIcon, LockIcon, EditIcon } from '@chakra-ui/icons';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useAppSelector, useAppDispatch } from '@/store/ReduxHook';
import { getProfile, updateProfile } from '@/store/actions';
import { UserType } from '@/types/Types';

const ProfileForm = () => {
  const dispatch = useAppDispatch();
  const { user, updateProfileLoading } = useAppSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);

  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'gray.200');

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('ⓘ Name is required')
      .min(3, 'ⓘ Name is too short'),
  });

  useEffect(() => {
    dispatch(getProfile({ data: {} }));
  }, []);

  const handleSubmit = (values: UserType) => {
    dispatch(
      updateProfile({
        data: {
          ...user,
          name: values.name,
          email: user?.email || '',
          password: user?.password || '',
        },
        callback: () => {
          dispatch(getProfile({ data: {} }));
          setIsEditing(false);
        },
      })
    );
  };

  return (
    <Box
      className='max-w-lg mx-auto p-6 rounded-lg shadow-md'
      // bg={bg}
      color={textColor}
    >
      <Text className='text-3xl font-bold text-gray-800 dark:text-gray-200 mb-8 text-center'>
        Profile Information
      </Text>

      <Formik
        initialValues={{
          name: user?.name || '',
          email: user?.email || '',
          password: user?.password || '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleSubmit }) => (
          <VStack as={Form} spacing={5} align='start'>
            {/* Name Field (Editable) */}
            <FormControl>
              <FormLabel className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                Name
              </FormLabel>
              <InputGroup>
                <Input
                  as={Field}
                  type='text'
                  name='name'
                  isDisabled={!isEditing}
                  className='text-xl text-gray-800 dark:text-gray-200 '
                />
                <InputLeftElement>
                  <EditIcon
                    color={isEditing ? 'blue.500' : 'gray.400'}
                    onClick={() => setIsEditing(true)}
                  />
                </InputLeftElement>
              </InputGroup>
              <Box>
                <Flex
                  color='error'
                  component='p'
                  mt={2}
                  as={ErrorMessage}
                  fontSize='small'
                  name='name'
                />
              </Box>
            </FormControl>

            {/* Email (Locked) */}
            <FormControl>
              <FormLabel className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                Email
              </FormLabel>
              <InputGroup>
                <Input
                  value={values?.email || ''}
                  className='text-xl text-gray-800 dark:text-gray-200 '
                  isReadOnly
                  isDisabled
                />
                <InputLeftElement>
                  <EmailIcon color='gray.400' />
                </InputLeftElement>
                <InputRightElement>
                  <LockIcon color='gray.400' />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Password (Locked) */}
            <FormControl>
              <FormLabel className='text-xl font-bold text-gray-800 dark:text-gray-200 mb-2'>
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  type='text'
                  value={values.password}
                  isReadOnly
                  isDisabled
                  className='text-xl text-gray-800 dark:text-gray-200 '
                />
                <InputLeftElement>
                  <LockIcon color='gray.400' />
                </InputLeftElement>
                <InputRightElement>
                  <LockIcon color='gray.400' />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {/* Buttons */}
            {isEditing ? (
              <VStack w='full'>
                <Button
                  w='full'
                  colorScheme='blue'
                  onClick={() => handleSubmit()}
                  isLoading={updateProfileLoading}
                >
                  Save Changes
                </Button>
                <Button
                  w='full'
                  variant='outline'
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </VStack>
            ) : (
              <Button
                w='full'
                colorScheme='blue'
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </VStack>
        )}
      </Formik>
    </Box>
  );
};

export default ProfileForm;
