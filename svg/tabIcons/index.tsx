import {SvgProps} from 'react-native-svg';
import HomeTabFocus from './Home2TabFocusIcon.svg';
import HomeTab from './Home2TabIcon.svg';
import SearchTab from './SearchTabIcon.svg';
import SearchTabFocus from './SearchTabFocusIcon.svg';
import ToolsTabFocus from './ToolsTabFocusIcon.svg';
import ToolsTab from './ToolsTabIcon.svg';
import RecentTab from './RecentTabIcon.svg';
import RecentTabFocus from './RecentTabFocusIcon.svg';
import ProfileTab from './ProfileTabIcon.svg';
import {FC} from 'react';

export const HomeTabIcon: FC<SvgProps> = ({...rest}) => <HomeTab {...rest} />;
export const HomeTabFocusIcon: FC<SvgProps> = ({...rest}) => (
  <HomeTabFocus {...rest} />
);
export const SearchTabIcon: FC<SvgProps> = ({...rest}) => (
  <SearchTab {...rest} />
);
export const SearchTabFocusIcon: FC<SvgProps> = ({...rest}) => (
  <SearchTabFocus {...rest} />
);
export const ToolsTabIcon: FC<SvgProps> = ({...rest}) => <ToolsTab {...rest} />;
export const ToolsTabFocusIcon: FC<SvgProps> = ({...rest}) => (
  <ToolsTabFocus {...rest} />
);
export const RecentTabIcon: FC<SvgProps> = ({...rest}) => (
  <RecentTab {...rest} />
);
export const RecentTabFocusIcon: FC<SvgProps> = ({...rest}) => (
  <RecentTabFocus {...rest} />
);
export const ProfileTabIcon: FC<SvgProps> = ({...rest}) => (
  <ProfileTab {...rest} />
);
