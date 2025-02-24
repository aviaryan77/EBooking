import React from 'react';

import ArrowLeft from './auth/ArrowLeftIcon.svg';
import Back from './auth/BackIcon.svg';
import Book from './auth/BookIcon.svg';
import Admin from './auth/AdminIcon.svg';
import SuperAdmin from './auth/SuperAdminIcon.svg';
import Student from './auth/StudentIcon.svg';
import ChevronDown from './auth/ChevronDownIcon.svg';
import ChevronRight from './auth/ChevronRightIcon.svg';
import ChevronUp from './auth/ChevronUpIcon.svg';
import Close from './auth/CloseIcon.svg';
import CloseCircle from './auth/CloseCircleIcon.svg';
import Date from './auth/DateIcon.svg';
import Delete from './profile/DeleteIcon.svg';
import Email from './auth/MailIcon.svg';
import Facebook from './socialMedia/FacebookIcon.svg';
import File from './auth/FileIcon.svg';
import Guard from './profile/GuardIcon.svg';
import Hamburger from './auth/HamburgerIcon.svg';
import Help from './auth/HelpIcon.svg';
import Image from './auth/ImageIcon.svg';
import Info from './auth/InfoIcon.svg';
import Instagram from './socialMedia/InstagramIcon.svg';
import Institute from './profile/InstituteIcon.svg';
import LinkedIn from './socialMedia/LinkedInIcon.svg';
import Lock from './profile/LockIcon.svg';
import Logo from './auth/LogoIcon.svg';
import LogoTransparentIcon from './auth/LogoTransparent.svg';
import Logout from './profile/LogoutIcon.svg';
import Pencil from './auth/PencilIcon.svg';
import Phone from './auth/PhoneIcon.svg';
import PhoneCall from './auth/PhoneCallIcon.svg';
import Pin from './profile/PinIcon.svg';
import Profile from './profile/ProfileIcon.svg';
import Refresh from './auth/RefreshIcon.svg';
import RightArrowIcon from './auth/RightArrow.svg';
import Twitter from './socialMedia/TwitterIcon.svg';
import WhatsApp from './auth/WhatsAppIcon.svg';
import YouTube from './socialMedia/YouTubeIcon.svg';
import { COLORS, PressableBox } from '../theme';

export const MailIcon = ({color = COLORS.primary, ...rest}) => (
  <Email color={color} {...rest} />
);

export const WhatsAppIcon = ({color = COLORS.primary, ...rest}) => (
  <WhatsApp color={color} {...rest} />
);

export const InfoIcon = ({color = COLORS.primary, ...rest}) => (
  <Info color={color} {...rest} />
);

export const PhoneIcon = ({color = COLORS.primary, ...rest}) => (
  <Phone color={color} {...rest} />
);

export const PhoneCallIcon = ({color = COLORS.primary, ...rest}) => (
  <PhoneCall color={color} {...rest} />
);

export const RightArrow = ({color = COLORS.primary, ...rest}) => (
  <RightArrowIcon color={color} {...rest} />
);

export const ArrowLeftIcon = ({color = COLORS.primary, ...rest}) => (
  <ArrowLeft color={color} {...rest} />
);

export const PencilIcon = ({
  color = COLORS.primary,
  onPress = () => {},
  ...rest
}) => (
  <PressableBox onPress={onPress}>
    <Pencil color={color} {...rest} />
  </PressableBox>
);
export const BookIcon = ({
  color = COLORS.primary,
  onPress = () => {},
  ...rest
}) => (
  <PressableBox onPress={onPress}>
    <Book color={color} {...rest} />
  </PressableBox>
);

export const DeleteIcon = ({
  color ='#BD3D3D',
  onPress = () => {},
  ...rest
}) => (
  <PressableBox onPress={onPress}>
    <Delete color={color} {...rest} />
  </PressableBox>
);

export const BackIcon = ({color = COLORS.primary, ...rest}) => (
  <Back color={color} {...rest} />
);
export const AdminIcon = ({color = COLORS.primary, ...rest}) => (
  <Admin color={color} {...rest} />
);
export const SuperAdminIcon = ({color = COLORS.primary, ...rest}) => (
  <SuperAdmin color={color} {...rest} />
);
export const StudentIcon = ({color = COLORS.primary, ...rest}) => (
  <Student color={color} {...rest} />
);
export const LogoIcon = ({color = COLORS.primary, ...rest}) => (
  <Logo color={color} {...rest} />
);
export const LogoTransparent = ({color = COLORS.primary, ...rest}) => (
  <LogoTransparentIcon color={color} {...rest} />
);

export const HelpIcon = ({color = COLORS.primary, ...rest}) => (
  <Help color={color} {...rest} />
);
export const ChevronRightIcon = ({color = COLORS.primary, ...rest}) => (
  <ChevronRight color={color} {...rest} />
);
export const ChevronDownIcon = ({color = COLORS.primary, ...rest}) => (
  <ChevronDown color={color} {...rest} />
);
export const ChevronUpIcon = ({color = COLORS.primary, ...rest}) => (
  <ChevronUp color={color} {...rest} />
);
export const RefreshIcon = ({color = COLORS.primary, ...rest}) => (
  <Refresh color={color} {...rest} />
);

export const CloseIcon = ({
  color = COLORS.primary,
  onPress = () => {},
  ...rest
}) => (
  <PressableBox onPress={onPress}>
    <Close color={color} {...rest} />
  </PressableBox>
);
export const CloseCircleIcon = ({
  color = COLORS.primary,
  onPress = () => {},
  ...rest
}) => (
  <PressableBox onPress={onPress}>
    <CloseCircle color={color} {...rest} />
  </PressableBox>
);

export const LockIcon = ({
  color = COLORS.primary,
  onPress = () => {},
  ...rest
}) => (
  <PressableBox onPress={onPress}>
    <Lock color={color} {...rest} />
  </PressableBox>
);
export const HamburgerIcon = ({
  color = COLORS.primary,
  onPress = () => {},
  ...rest
}) => (
  <PressableBox
    hitSlop={{top: 20, bottom: 20, left: 50, right: 50}}
    onPress={onPress}>
    <Hamburger color={color} {...rest} />
  </PressableBox>
);

export const FacebookIcon = ({color = COLORS.primary, ...rest}) => (
  <Facebook color={color} {...rest} />
);

export const InstagramIcon = ({color = COLORS.primary, ...rest}) => (
  <Instagram color={color} {...rest} />
);

export const TwitterIcon = ({color = COLORS.primary, ...rest}) => (
  <Twitter color={color} {...rest} />
);

export const LinkedInIcon = ({color = COLORS.primary, ...rest}) => (
  <LinkedIn color={color} {...rest} />
);

export const YouTubeIcon = ({color = COLORS.primary, ...rest}) => (
  <YouTube color={color} {...rest} />
);

export const GuardIcon = ({color = COLORS.primary, ...rest}) => (
  <Guard color={color} {...rest} />
);
export const ProfileIcon = ({color = COLORS.primary, ...rest}) => (
  <Profile color={color} {...rest} />
);
export const InstituteIcon = ({color = COLORS.primary, ...rest}) => (
  <Institute color={color} {...rest} />
);
export const LogoutIcon = ({color = COLORS.error, ...rest}) => (
  <Logout color={color} {...rest} />
);
export const PinIcon = ({color = COLORS.text?.secondary, ...rest}) => (
  <Pin color={color} {...rest} />
);
export const ImageIcon = ({color = COLORS.text?.secondary, ...rest}) => (
  <Image color={color} {...rest} />
);
export const FileIcon = ({color = COLORS.text?.secondary, ...rest}) => (
  <File color={color} {...rest} />
);
export const DateIcon = ({color = COLORS.text?.secondary, ...rest}) => (
  <Date color={color} {...rest} />
);
