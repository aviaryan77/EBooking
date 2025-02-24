import React, {FC} from 'react';
import {
  HomeTabIcon,
  ProfileTabIcon,
  RecentTabIcon,
  SearchTabIcon,
  ToolsTabIcon,
  HomeTabFocusIcon,
  RecentTabFocusIcon,
  SearchTabFocusIcon,
  ToolsTabFocusIcon,
} from '../svg/tabIcons';

interface TabIconProps extends React.SVGProps<SVGSVGElement> {
  type: string;
  color: string;
  focused: boolean;
}
export const TabIcon: FC<TabIconProps> = ({
  type,
  color,
  focused,
  ...props
}: {
  type: string;
  color: string;
  focused: boolean;
}) => {
  switch (type) {
    case 'Home':
      return focused ? <HomeTabFocusIcon /> : <HomeTabIcon />;
    case 'Recent':
      return focused ? <RecentTabFocusIcon /> : <RecentTabIcon />;
    case 'Search':
      return focused ? <SearchTabFocusIcon /> : <SearchTabIcon />;
    case 'Bookings':
      return focused ? <ToolsTabFocusIcon /> : <ToolsTabIcon />;
    case 'Profile':
      return focused ? <ProfileTabIcon /> : <ProfileTabIcon />;
    default:
      return null;
  }
};
