import React, {useState} from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  TextInputProps,
  Platform,
} from 'react-native';
import {COLORS} from './COLORS';
import {Flex, VStack} from './containers';
import {Text} from './text';

interface TextInputPropsWithIcons extends TextInputProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isValid?: boolean;
  onFocus?: () => void;
  // containerStyle?: StyleProp<View>;
  containerStyle?: any;
  onBlur?: (e: any) => void;
}

export const TextInput: React.FC<TextInputPropsWithIcons> = ({
  leftIcon,
  rightIcon,
  isValid = true,
  onFocus = () => {},
  containerStyle,
  onBlur = () => {},
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <Flex
      alignItems="center"
      borderWidth={1}
      borderColor={isFocused ? COLORS.border.focused : COLORS.border.primary}
      borderRadius={8}
      py={Platform.OS === 'ios' ? 12 : 2}
      px={12}
      gap={12}
      {...containerStyle}>
      {leftIcon && leftIcon}
      <RNTextInput
        style={{
          flex: 1,
          fontSize: 14,
          letterSpacing: 0.8,
          color: COLORS.text.primary,
          fontFamily: 'Roboto-Medium',
        }}
        placeholderTextColor={COLORS.text.placeholder}
        onFocus={() => {
          setIsFocused(true);
          onFocus();
        }}
        onBlur={(e: any) => {
          setIsFocused(true);
          onBlur(e);
        }}
        {...restProps}
      />
      {rightIcon && rightIcon}
    </Flex>
  );
};

interface ProfileTextInputProps extends TextInputProps {
  isValid?: boolean;
  fieldName?: string;
  onFocus?: () => void;
  editable?: boolean;
  inputRef?: any;
  // containerStyle?: StyleProp<View>;
  containerStyle?: any;
  onBlur?: (e: any) => void;
}

export const ProfileTextInput: React.FC<ProfileTextInputProps> = ({
  isValid = true,
  inputRef,
  editable = true,
  fieldName,
  onFocus = () => {},
  containerStyle,
  onBlur = () => {},
  ...restProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <VStack {...containerStyle}>
      <Text variant="medium" color={COLORS.text.placeholder}>
        {fieldName}
      </Text>
      <Flex
        alignItems="center"
        borderColor={isFocused ? COLORS.border.focused : COLORS.border.primary}
        borderRadius={8}
        py={Platform.OS === 'ios' ? 12 : 2}
        px={6}
        gap={12}
        >
        <RNTextInput
          ref={inputRef}
          editable={editable}
          style={{
            flex: 1,
            fontSize: 14,
            letterSpacing: 0.8,
            color: editable ? COLORS.text.primary : COLORS.text.placeholder,
            fontFamily: 'Roboto-Medium',
            fontWeight: 'bold',
          }}
          placeholderTextColor={COLORS.text.placeholder}
          onFocus={() => {
            setIsFocused(true);
            onFocus();
          }}
          onBlur={(e: any) => {
            setIsFocused(true);
            onBlur(e);
          }}
          {...restProps}
        />
      </Flex>
    </VStack>
  );
};

const styles = StyleSheet.create({});

export default TextInput;
