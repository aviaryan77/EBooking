import {PressableProps} from 'react-native';

export interface LayoutProps extends SpacingProps, FlexBoxProps, FlexProps {
  alignSelf?: 'center' | 'flex-start' | 'flex-end';
  borderRadius?: number;
  rounded?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  bg?: string;
  bgColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderTopColor?: string;
  borderBottomColor?: string;
  borderLeftColor?: string;
  borderRightColor?: string;
  opacity?: number;
  // Add more shorthand properties as needed
  style?: any;
}

export interface TransparentStatusBarProps {
  // barStyle?: StatusBar['barStyle'];
  bgColor?: string;
}

export interface ScreenProps {
  translucent?: boolean;
  bg?: string;
  bgColor?: string;

  barStyle?: 'light-content' | 'dark-content';
}

export interface FlexBoxProps {
  flex?: number;
  flexDir?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexGrow?: number;
  gap?: number;
  justify?:
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'flex-start'
    | 'flex-end';
  justifyContent?:
    | 'center'
    | 'space-between'
    | 'space-around'
    | 'flex-start'
    | 'flex-end';
  align?: 'center' | 'flex-start' | 'flex-end';
  alignItems?: 'center' | 'flex-start' | 'flex-end';
  border?: number;
  borderWidth?: number;
  borderBottomWidth?: number;
  borderTopWidth?: number;
  borderLeftWidth?: number;
  borderRightWidth?: number;
  alignSelf?: 'center' | 'flex-start' | 'flex-end';
  overflow?: 'hidden' | 'visible' | 'scroll';
}

export interface SpacingProps {
  m?: number | string;
  margin?: number | string;
  w?: number | string;
  width?: number | string;
  h?: number | string;
  height?: number | string;
  p?: number | string;
  padding?: number | string;
  pt?: number | string;
  paddingTop?: number | string;
  pl?: number | string;
  paddingLeft?: number | string;
  pr?: number | string;
  paddingRight?: number | string;
  pb?: number | string;
  paddingBottom?: number | string;
  py?: number | string;
  paddingVertical?: number | string;
  px?: number | string;
  paddingHorizontal?: number | string;
  mt?: number | string;
  marginTop?: number | string;
  ml?: number | string;
  marginLeft?: number | string;
  mr?: number | string;
  marginRight?: number | string;
  mb?: number | string;
  marginBottom?: number | string;
  my?: number | string;
  marginVertical?: number | string;
  mx?: number | string;
  marginHorizontal?: number | string;
  zIndex?: number;
  elevation?: number;
  position?: 'absolute' | 'relative';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
}

export interface FlexProps {
  w?: number | string;
  maxWidth?: number | string;
  minWidth?: number | string;
  maxHeight?: number | string;
  align?: 'center' | 'flex-start' | 'flex-end';
  flexDir?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  flexWrap?: 'wrap' | 'nowrap';
  // Add more specific props if needed
}

export interface CenterProps {
  align?: 'center' | 'flex-start' | 'flex-end';
  justify?: 'center' | 'flex-start' | 'flex-end';
  // Add more specific props if needed
}

export interface BoxProps extends LayoutProps {}

export interface VStackProps extends LayoutProps {}

export interface PressableBoxProps extends PressableProps {}
