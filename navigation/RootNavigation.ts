import {createNavigationContainerRef} from '@react-navigation/native';
import * as React from 'react';

export const navigationRef = createNavigationContainerRef<any>();
export const isReadyRef = React.createRef();

export function navigate(name: string, params?: object) {
  if (isReadyRef.current && navigationRef.current) {
    navigationRef.current.navigate(name as never, params as never);
  } else {
    setTimeout(() => {
      navigate(name, params);
    }, 1000);
  }
}

export const goBack = () => navigationRef.current?.goBack();
