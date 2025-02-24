import {Text as RnText, TextProps, TextStyle} from 'react-native';
import {COLORS} from '.';
import {LayoutProps} from './themeTypes';

export const FONTS = {
  regular: 'Roboto-Regular',
  bold: 'Roboto-Bold',
  black: 'Roboto-Black',
  RammettoOne:'RammettoOne-Regular',
  light: 'Roboto-light',
  medium: 'Roboto-Medium',
  semiBold: 'Roboto-Medium',
};

export type textVariants =
  | 'header'
  | 'heading2'
  | 'title'
  | 'description'
  | 'textBlack'
  | 'normal'
  | 'bold'
  | 'semiBold'
  | 'medium'
  | 'medium16'
  | 'regular16'
  | 'regular';

const matchVariants = (variant?: textVariants) => {
  switch (variant) {
    case 'header':
      return {
        color: COLORS.text.primary,
        fontSize: 28,
        fontFamily: FONTS.medium,
      };
    case 'heading2':
      return {
        color: COLORS.text.primary,
        fontSize: 20,
        fontFamily: FONTS.medium,
      };
    case 'title':
      return {
        fontSize: 18,
        lineHeight: 28,
        fontFamily: FONTS.semiBold,
        color: COLORS.text.primary,
      };
    case 'bold':
      return {
        fontSize: 14,
        fontFamily: FONTS.bold,
        color: COLORS.text.primary,
      };
    case 'semiBold':
      return {
        fontSize: 14,
        fontFamily: FONTS.semiBold,
        color: COLORS.text.primary,
      };
    case 'medium':
      return {
        fontSize: 14,
        fontFamily: FONTS.medium,
        color: COLORS.text.primary,
      };
    case 'medium16':
      return {
        fontSize: 16,
        fontFamily: FONTS.medium,
        color: COLORS.text.primary,
      };
    case 'textBlack':
      return {
        fontSize: 12,
        fontWeight: 500,
        color: COLORS.text.primary,
      };

    case 'description':
      return {
        fontFamily: FONTS.regular,
        color: COLORS.text.primary,
        fontSize: 12,
      };
    case 'regular16':
      return {
        fontFamily: FONTS.regular,
        color: COLORS.text.primary,
        fontSize: 16,
      };
    case 'regular':
      return {
        fontFamily: FONTS.regular,
        color: COLORS.text.primary,
        fontSize: 14,
      };

    default:
      return {
        fontSize: 14,
        fontFamily: FONTS.regular,
        color: COLORS.text.primary,
      };
  }
};

const getFontFamilyByWeight = (fontWeight: any) => {
  switch (Number(fontWeight)) {
    case 400:
      return {
        fontFamily: FONTS.regular,
      };
    case 500:
      return {
        fontFamily: FONTS.medium,
      };
    case 600:
      return {
        fontFamily: FONTS.semiBold,
      };
    case 700:
      return {
        fontFamily: FONTS.bold,
      };

    default:
      return {fontFamily: FONTS.regular};
  }
};

/**
 * @Text Component use //@ts-check at start of the component to show error
 * @param {Object} obj wrapping object
 * @param {('header'|'title'|'description'| 'textBlack' | 'normal')} obj.variant variant of the text
 * @param {string} obj.fontSize the body of the post
 * @param {boolean} obj.fontScaling the body of the post
 * @param {string} obj.fontSize the body of the post
 * @param {Object} obj.style the body of the post
 * @param {string} obj.color the body of the post
 * @returns
 */

export const Text = ({
  mb,
  my,
  ml,
  px,
  mt,
  text,
  style,
  color,
  fontSize,
  children,
  textAlign,
  fontFamily,
  lineHeight,
  fontWeight,
  textDecorationLine,
  allowFontScaling = false,
  variant, // important for short hand
  ...rest
}: TextStyle &
  TextProps &
  LayoutProps & {
    text?: TextProps['children'] | string;
    variant?: textVariants;
  }) => {
  return (
    <RnText
      allowFontScaling={allowFontScaling}
      style={{
        ...matchVariants(variant),
        ...{color: color || COLORS.primaryText},
        ...(mt && {marginTop: mt}),
        ...(fontSize && {fontSize: fontSize}),
        ...(textAlign && {textAlign}),
        ...(mb && {marginBottom: mb}),
        ...(ml && {marginLeft: ml}),
        ...(fontFamily && {fontFamily}),
        ...(lineHeight && {lineHeight}),
        ...(my && {marginVertical: my}),
        ...(px && {paddingHorizontal: px}),
        ...(textDecorationLine && {textDecorationLine}),
        ...(fontWeight && getFontFamilyByWeight(fontWeight)),
        ...style,
      }}
      {...rest}>
      {text}
      {children}
    </RnText>
  );
};
