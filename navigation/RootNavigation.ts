import {createNavigationContainerRef} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export function navigate(name: string, params?: object) {
  if (navigationRef.current) {
    navigationRef.current.navigate(name as never, params as never);
  } else {
    setTimeout(() => {
      navigate(name, params);
    }, 1000);
  }
}

export const goBack = () => navigationRef.current?.goBack();
